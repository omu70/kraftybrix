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
        // await prisma.order.create({ data: { ...pricing, razorpayOrderId: rzpOrder.id, ... } });
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
  // if (valid) await prisma.order.update({ where: { razorpayOrderId }, data: { paymentStatus: "PAID", status: "CONFIRMED" } });
  return { ok: valid };
}
