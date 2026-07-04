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
