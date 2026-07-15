"use server";

import { z } from "zod";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ADVANCE_FEE, COUPONS, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/constants";
// import { prisma } from "@/lib/prisma";

/** The signed-in customer's id, or null for guest checkout. */
async function currentUserId(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    return (session?.user as { id?: string } | undefined)?.id ?? null;
  } catch {
    return null;
  }
}

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(8),
  email: z.string().email(),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
});

const lineSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number(),
  qty: z.number().int().positive(),
});

const checkoutSchema = z.object({
  address: addressSchema,
  lines: z.array(lineSchema).min(1),
  couponCode: z.string().optional(),
  paymentMethod: z.enum(["ONLINE", "PARTIAL_COD"]),
});

type CouponMap = Record<string, { type: "PERCENT" | "FIXED"; value: number }>;

/** Active coupons = built-in codes + any the owner added in the admin (DB). */
async function getCoupons(): Promise<CouponMap> {
  const base: CouponMap = { ...COUPONS };
  if (!process.env.DATABASE_URL) return base;
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.coupon.findMany({ where: { active: true } });
    for (const r of rows) base[r.code.toUpperCase()] = { type: r.type as "PERCENT" | "FIXED", value: r.value };
    return base;
  } catch {
    return base;
  }
}

function priceOrder(lines: { price: number; qty: number }[], code?: string, coupons: CouponMap = COUPONS) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  let discount = 0;
  if (code && coupons[code]) {
    const c = coupons[code];
    discount = c.type === "PERCENT" ? Math.round((subtotal * c.value) / 100) : c.value;
  }
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, total };
}

const dbEnabled = () => !!process.env.DATABASE_URL;

type PersistArgs = {
  orderNumber: string;
  address: z.infer<typeof addressSchema>;
  lines: z.infer<typeof lineSchema>[];
  pricing: ReturnType<typeof priceOrder>;
  paymentMethod: "ONLINE" | "PARTIAL_COD";
  paymentStatus: "PENDING" | "PARTIAL" | "PAID";
  amountPaid: number;
  codBalance: number;
  couponCode?: string;
  razorpayOrderId?: string;
  userId?: string | null;
  status: "PENDING" | "CONFIRMED";
};

/** Write the order to Postgres (no-op when no DATABASE_URL). */
async function persistOrder(a: PersistArgs) {
  if (!dbEnabled()) return;
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.order.create({
      data: {
        orderNumber: a.orderNumber,
        guestEmail: a.address.email,
        userId: a.userId ?? null,
        status: a.status,
        paymentMethod: a.paymentMethod,
        paymentStatus: a.paymentStatus,
        razorpayOrderId: a.razorpayOrderId ?? null,
        subtotal: a.pricing.subtotal,
        discount: a.pricing.discount,
        shipping: a.pricing.shipping,
        total: a.pricing.total,
        amountPaid: a.amountPaid,
        codBalance: a.codBalance,
        couponCode: a.couponCode ?? null,
        shippingAddress: a.address as unknown as object,
        items: {
          create: a.lines.map((l) => ({
            productId: l.productId, name: l.name, price: l.price, quantity: l.qty,
          })),
        },
      },
    });
  } catch (e) {
    console.error("[order] persist failed:", e);
  }
}

/** Send an order-confirmation email via Resend (no-op when unset). */
async function sendOrderEmail(
  to: string, name: string, orderNumber: string, total: number, amountPaid = total, codBalance = 0
) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const payLine = codBalance > 0
    ? `<p>Paid now: <b>${inr(amountPaid)}</b> · Pay on delivery: <b>${inr(codBalance)}</b></p>`
    : `<p>Paid: <b>${inr(total)}</b></p>`;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "KraftyBrix <hello@kraftybrix.com>",
      to,
      subject: `Your KraftyBrix order ${orderNumber} is confirmed 🏁`,
      html: `<div style="font-family:sans-serif"><h2>Thanks, ${name}!</h2><p>Order <b>${orderNumber}</b> is confirmed and ships within 24 hours.</p><p>Order total: <b>${inr(total)}</b></p>${payLine}<p>— KraftyBrix</p></div>`,
    });
  } catch (e) {
    console.error("[email] send failed:", e);
  }
}

/** Validate a coupon (called from the checkout UI). */
export async function applyCoupon(code: string, subtotal: number) {
  const coupons = await getCoupons();
  const c = coupons[code.toUpperCase()];
  if (!c) return { ok: false as const, error: "Invalid coupon code." };
  const discount = c.type === "PERCENT" ? Math.round((subtotal * c.value) / 100) : c.value;
  return { ok: true as const, code: code.toUpperCase(), discount };
}

/**
 * Create an order. Both methods collect money online via Razorpay:
 *  • ONLINE       → the full order total is charged now.
 *  • PARTIAL_COD  → only the ₹99 advance is charged now; the rest is
 *                   collected as cash on delivery (codBalance).
 * Returns the Razorpay order id so the client can open the checkout widget.
 */
export async function createOrder(input: z.infer<typeof checkoutSchema>) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid checkout data." };

  const { lines, couponCode, paymentMethod, address } = parsed.data;
  const coupons = await getCoupons();
  const pricing = priceOrder(lines, couponCode?.toUpperCase(), coupons);
  const orderNumber = "KB" + Date.now().toString(36).toUpperCase();
  const userId = await currentUserId();

  // How much is charged online now vs collected on delivery.
  const payNow = paymentMethod === "PARTIAL_COD" ? Math.min(ADVANCE_FEE, pricing.total) : pricing.total;
  const codBalance = paymentMethod === "PARTIAL_COD" ? Math.max(0, pricing.total - payNow) : 0;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? keyId ?? "";

  // Live/test: create a real Razorpay order for the online portion.
  // Works in TEST mode with rzp_test_* keys — use the test cards below.
  if (keyId && keySecret) {
    try {
      const Razorpay = (await import("razorpay")).default;
      const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
      const rzpOrder = await rzp.orders.create({
        amount: payNow * 100, // amount in paise
        currency: "INR",
        receipt: orderNumber,
        notes: { coupon: couponCode ?? "", email: address.email, method: paymentMethod },
      });
      await persistOrder({
        orderNumber, address, lines, pricing, paymentMethod, couponCode, userId,
        razorpayOrderId: rzpOrder.id, status: "PENDING", paymentStatus: "PENDING",
        amountPaid: 0, codBalance,
      });
      return {
        ok: true as const, orderNumber, method: paymentMethod,
        total: pricing.total, payNow, codBalance,
        razorpayOrderId: rzpOrder.id, keyId: publicKey,
      };
    } catch (e) {
      console.error("[razorpay] order create failed:", e);
      return { ok: false as const, error: "Could not start payment. Please try again." };
    }
  }

  // No keys yet — simulate the payment so the whole flow is testable, and
  // record the order as confirmed so it shows up in the admin.
  await persistOrder({
    orderNumber, address, lines, pricing, paymentMethod, couponCode, userId,
    status: "CONFIRMED", paymentStatus: paymentMethod === "PARTIAL_COD" ? "PARTIAL" : "PAID",
    amountPaid: payNow, codBalance,
  });
  await sendOrderEmail(address.email, address.fullName, orderNumber, pricing.total, payNow, codBalance);
  return {
    ok: true as const, orderNumber, method: paymentMethod,
    total: pricing.total, payNow, codBalance,
    razorpayOrderId: `order_demo_${orderNumber}`, keyId: publicKey, demo: true as const,
  };
}

/** Verify Razorpay signature server-side after payment. */
export async function verifyPayment(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  if (!secret) return { ok: true }; // demo mode — nothing to verify
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${input.razorpayOrderId}|${input.razorpayPaymentId}`)
    .digest("hex");
  const valid = expected === input.signature;

  if (valid && dbEnabled()) {
    try {
      const { prisma } = await import("@/lib/prisma");
      const existing = await prisma.order.findUnique({ where: { razorpayOrderId: input.razorpayOrderId } });
      if (existing) {
        const isPartial = existing.paymentMethod === "PARTIAL_COD";
        const order = await prisma.order.update({
          where: { razorpayOrderId: input.razorpayOrderId },
          data: {
            status: "CONFIRMED",
            paymentStatus: isPartial ? "PARTIAL" : "PAID",
            amountPaid: existing.total - existing.codBalance,
            razorpayPaymentId: input.razorpayPaymentId,
          },
        });
        if (order.guestEmail) {
          const addr = order.shippingAddress as { fullName?: string } | null;
          await sendOrderEmail(order.guestEmail, addr?.fullName ?? "there", order.orderNumber, order.total, order.amountPaid, order.codBalance);
        }
      }
    } catch (e) {
      console.error("[verify] order update failed:", e);
    }
  }
  return { ok: valid };
}
