import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

/** Records a visitor heartbeat for the admin "Live" panel. No-op without a DB. */
export async function POST(req: Request) {
  let path = "/";
  try { path = (await req.json())?.path ?? "/"; } catch {}

  const jar = await cookies();
  let vid = jar.get("kb_vid")?.value;
  const res = NextResponse.json({ ok: true });
  if (!vid) {
    vid = crypto.randomUUID();
    res.cookies.set("kb_vid", vid, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 365, path: "/" });
  }

  if (process.env.DATABASE_URL) {
    try {
      const country = (await headers()).get("x-vercel-ip-country") ?? null;
      const { prisma } = await import("@/lib/prisma");
      await prisma.liveVisitor.upsert({
        where: { id: vid },
        update: { path: path.slice(0, 200), country },
        create: { id: vid, path: path.slice(0, 200), country },
      });
    } catch (e) {
      console.error("[track] failed:", e);
    }
  }
  return res;
}
