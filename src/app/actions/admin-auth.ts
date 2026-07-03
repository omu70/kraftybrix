"use server";

import { cookies } from "next/headers";

/**
 * Simple admin gate. Set two env vars for launch:
 *   ADMIN_PASSWORD  — what you type on /admin/login
 *   ADMIN_SESSION   — a random secret the cookie stores (openssl rand -hex 16)
 * With both set, /admin is locked; without them, /admin stays open (preview).
 */
export async function adminLogin(_prev: unknown, formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  const expectedPw = process.env.ADMIN_PASSWORD;
  const session = process.env.ADMIN_SESSION;

  if (!expectedPw || !session) {
    return { ok: false, error: "Admin auth isn't configured yet (set ADMIN_PASSWORD + ADMIN_SESSION)." };
  }
  if (pw !== expectedPw) return { ok: false, error: "Incorrect password." };

  (await cookies()).set("kb_admin", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return { ok: true };
}

export async function adminLogout() {
  (await cookies()).delete("kb_admin");
  return { ok: true };
}
