"use server";

import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
});

/**
 * Newsletter subscription server action.
 * Persists to Postgres (when DATABASE_URL is set) and sends a welcome
 * email via Resend (when RESEND_API_KEY is set). Both are no-ops otherwise.
 */
export async function subscribeNewsletter(formData: FormData) {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Please enter a valid name and email." };
  }

  const { name, email } = parsed.data;

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.subscriber.upsert({
        where: { email },
        update: { name },
        create: { name, email },
      });
    } catch (e) {
      console.error("[newsletter] persist failed:", e);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "KraftyBrix <hello@kraftybrix.com>",
        to: email,
        subject: "Welcome to the KraftyBrix drop list 🏁",
        html: `<p>Hi ${name}, welcome aboard! Here's your 10% welcome code: <b>BRICK10</b></p>`,
      });
    } catch (e) {
      console.error("[newsletter] email failed:", e);
    }
  }

  return { ok: true };
}

const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().max(80).optional(),
  phone: z.string().max(20).optional(),
  source: z.string().max(30).optional(),
});

/**
 * Capture a lead from the on-site popup (email + optional name/phone).
 * Public, safe to call from the client. No-op persistence without a DB.
 */
export async function captureLead(input: {
  email: string; name?: string; phone?: string; source?: string;
}) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Please enter a valid email." };
  const { email, name, phone, source } = parsed.data;
  const lower = email.toLowerCase();

  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.subscriber.upsert({
        where: { email: lower },
        update: { name: name || undefined, phone: phone || undefined, source: source || "popup" },
        create: { email: lower, name: name || undefined, phone: phone || undefined, source: source || "popup" },
      });
    } catch (e) {
      console.error("[lead] persist failed:", e);
    }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "KraftyBrix <hello@kraftybrix.com>",
        to: lower,
        subject: "Here's your 10% off code 🏁",
        html: `<p>Welcome to KraftyBrix! Your code is <b>BRICK10</b> — 10% off your first build.</p>`,
      });
    } catch (e) {
      console.error("[lead] email failed:", e);
    }
  }

  return { ok: true as const, code: "BRICK10" };
}
