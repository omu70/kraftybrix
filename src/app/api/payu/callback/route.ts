import { NextResponse } from "next/server";
import { settlePayu } from "@/app/actions/checkout";

export const dynamic = "force-dynamic";

/** PayU posts the payment result here (surl/furl). We verify then redirect. */
export async function POST(req: Request) {
  const form = await req.formData();
  const p: Record<string, string> = {};
  for (const [k, v] of form.entries()) p[k] = typeof v === "string" ? v : "";

  const res = await settlePayu(p);

  const url = res.ok
    ? new URL(`/order-confirmed?order=${res.orderNumber}&paid=${res.payNow}&due=${res.codBalance}&payu=1`, req.url)
    : new URL(`/checkout?payu=failed`, req.url);

  // 303 so the browser switches PayU's POST to a GET on our page.
  return NextResponse.redirect(url, 303);
}

// If PayU ever GETs the URL, send the user somewhere sensible.
export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/checkout", req.url), 303);
}
