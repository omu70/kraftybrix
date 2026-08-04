import { NextResponse } from "next/server";
import { settlePayu } from "@/app/actions/checkout";

export const dynamic = "force-dynamic";

/**
 * PayU server-to-server webhook. Same verified settlement as the browser
 * callback, but fires independently — so a paid order is recorded even if the
 * customer closes the tab before being redirected back. Set this URL as your
 * webhook/S2S endpoint in the PayU dashboard.
 */
export async function POST(req: Request) {
  const ct = req.headers.get("content-type") || "";
  const p: Record<string, string> = {};
  if (ct.includes("application/json")) {
    try {
      const j = await req.json();
      for (const [k, v] of Object.entries(j ?? {})) p[k] = String(v ?? "");
    } catch {}
  } else {
    const form = await req.formData();
    for (const [k, v] of form.entries()) p[k] = typeof v === "string" ? v : "";
  }

  const res = await settlePayu(p); // verifies hash + amount, updates order idempotently
  return NextResponse.json({ ok: res.ok });
}
