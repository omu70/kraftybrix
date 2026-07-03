"use server";

import { z } from "zod";
import crypto from "crypto";
// import { prisma } from "@/lib/prisma";

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
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
});

const COUPONS: Record<string, { type: "PERCENT" | "FIXED"; value: number }> = {
  BRICK10: { type: "PERCENT", value: 10 },
  WELCOME500: { type: "FIXED", value: 500 },
};

function priceOrder(lines: { price: number; qty: number }[], code?: string) {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  let discount = 0;
  if (code && COUPONS[code]) {
    const c = COUPONS[code];
    discount = c.type === "PERCENT" ? Math.round((subtotal * c.value) / 100) : c.value;
  }
  const shipping = subtotal - discount >= 9999 ? 0 : 199;
  const total = Math.max(0, subtotal - discount + shipping);
  return { subtotal, discount, shipping, total };
}

const dbEnabled = () => !!process.env.DATABASE_URL;

type PersistArgs = {
  orderNumber: string;
  address: z.infer<typeof addressSchema>;
  lines: z.infer<typeof lineSchema>[];
  pricing: ReturnType<typeof priceOrder>;
  paymentMethod: "RAZORPAY" | "COD";
  couponCode?: string;
  razorpayOrderId?: string;
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
        status: a.status,
        paymentMethod: a.paymentMethod,
        paymentStatus: a.paymentMethod === "COD" ? "PENDING" : a.status === "CONFIRMED" ? "PAID" : "PENDING",
        razorpayOrderId: a.razorpayOrderId ?? null,
        subtotal: a.pricing.subtotal,
        discount: a.pricing.discount,
        shipping: a.pricing.shipping,
        total: a.pricing.total,
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
async function sendOrderEmail(to: string, name: string, orderNumber: string, total: number) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "KraftyBrix <hello@kraftybrix.com>",
      to,
      subject: `Your KraftyBrix order ${orderNumber} is confirmed 🏁`,
      html: `<div style="font-family:sans-serif"><h2>Thanks, ${name}!</h2><p>Order <b>${orderNumber}</b> is confirmed. Total: <b>₹${total.toLocaleString("en-IN")}</b>. It ships within 24 hours.</p><p>— KraftyBrix</p></div>`,
    });
  } catch (e) {
    console.error("[email] send failed:", e);
  }
}

/** Validate a coupon (called from the checkout UI). */
export async function applyCoupon(code: string, subtotal: number) {
  const c = COUPONS[code.toUpperCase()];
  if (!c) return { ok: false as const, error: "Invalid coupon code." };
  const discount = c.type === "PERCENT" ? Math.round((subtotal * c.value) / 100) : c.value;
  return { ok: true as const, code: code.toUpperCase(), discount };
}

/**
 * Create an order. For Razorpay, creates a Razorpay order and returns its id
 * so the client can open the checkout widget. For COD, persists immediately.
 */
export async function createOrder(input: z.infer<typeof checkoutSchema>) {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Invalid checkout data." };

  const { lines, couponCode, paymentMethod, address } = parsed.data;
  const pricing = priceOrder(lines, couponCode?.toUpperCase());
  const orderNumber = "KB" + Date.now().toString(36).toUpperCase();

  // Persist a PENDING order (stubbed until DB configured):
  // const order = await prisma.order.create({ data: { ... } });

  if (paymentMethod === "RAZORPAY") {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const publicKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? keyId ?? "";

    // Live/test: create a real Razorpay order so the checkout widget works.
    // Works in TEST mode with rzp_test_* keys — use the test cards below.
    if (keyId && keySecret) {
      try {
        const Razorpay = (await import("razorpay")).default;
        const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
        const rzpOrder = await rzp.orders.create({
          amount: pricing.total * 100, // amount in paise
          currency: "INR",
          receipt: orderNumber,
          notes: { coupon: couponCode ?? "", email: address.email },
        });
        await persistOrder({ orderNumber, address, lines, pricing, paymentMethod, couponCode, razorpayOrderId: rzpOrder.id, status: "PENDING" });
        return {
          ok: true as const,
          orderNumber,
          method: "RAZORPAY" as const,
          amount: pricing.total,
          razorpayOrderId: rzpOrder.id,
          keyId: publicKey,
        };
      } catch (e) {
        console.error("[razorpay] order create failed:", e);
        return { ok: false as const, error: "Could not start payment. Please try again." };
      }
    }

    // No keys configured yet — return a demo id so the UI flow is testable.
    return {
      ok: true as const,
      orderNumber,
      method: "RAZORPAY" as const,
      amount: pricing.total,
      razorpayOrderId: `order_demo_${orderNumber}`,
      keyId: publicKey,
      demo: true as const,
    };
  }

  // COD — confirmed immediately, email the customer.
  await persistOrder({ orderNumber, address, lines, pricing, paymentMethod, couponCode, status: "CONFIRMED" });
  await sendOrderEmail(address.email, address.fullName, orderNumber, pricing.total);
  return { ok: true as const, orderNumber, method: "COD" as const, amount: pricing.total };
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
      const order = await prisma.order.update({
        where: { razorpayOrderId: input.razorpayOrderId },
        data: { paymentStatus: "PAID", status: "CONFIRMED", razorpayPaymentId: input.razorpayPaymentId },
      });
      if (order.guestEmail) {
        const addr = order.shippingAddress as { fullName?: string } | null;
        await sendOrderEmail(order.guestEmail, addr?.fullName ?? "there", order.orderNumber, order.total);
      }
    } catch (e) {
      console.error("[verify] order update failed:", e);
    }
  }
  return { ok: valid };
}
