"use server";

import { z } from "zod";
// import { prisma } from "@/lib/prisma";
// import { Resend } from "resend";

const schema = z.object({
  name: z.string().min(1).max(80),
  email: z.string().email(),
});

/**
 * Newsletter subscription server action.
 * Persists to Postgres and sends a welcome email via Resend.
 * (DB/email calls are stubbed until env is configured.)
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

  // await prisma.subscriber.upsert({
  //   where: { email },
  //   update: { name },
  //   create: { name, email },
  // });

  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: process.env.RESEND_FROM_EMAIL!,
  //   to: email,
  //   subject: "Welcome to the KraftyBrix drop list",
  //   html: `<p>Hi ${name}, your 10% welcome code: <b>BRICK10</b></p>`,
  // });

  console.log("[newsletter] subscribed:", name, email);
  return { ok: true };
}
