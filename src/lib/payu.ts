import crypto from "crypto";

/** PayU (India) config from env. Set PAYU_MERCHANT_KEY, PAYU_SALT, PAYU_MODE=test|live. */
export function payuConfig() {
  const key = process.env.PAYU_MERCHANT_KEY || process.env.PAYU_KEY || "";
  const salt = process.env.PAYU_SALT || "";
  const mode = (process.env.PAYU_MODE || "test").toLowerCase();
  const live = mode === "live" || mode === "prod" || mode === "production";
  const base = live ? "https://secure.payu.in/_payment" : "https://test.payu.in/_payment";
  return { key, salt, base, live, enabled: !!(key && salt) };
}

const sha512 = (s: string) => crypto.createHash("sha512").update(s).digest("hex");
const u = (x?: string) => x ?? "";

/** Forward hash sent with the payment request. */
export function payuRequestHash(p: {
  key: string; txnid: string; amount: string; productinfo: string;
  firstname: string; email: string; salt: string;
  udf1?: string; udf2?: string; udf3?: string; udf4?: string; udf5?: string;
}) {
  const seq = [
    p.key, p.txnid, p.amount, p.productinfo, p.firstname, p.email,
    u(p.udf1), u(p.udf2), u(p.udf3), u(p.udf4), u(p.udf5),
    "", "", "", "", "", p.salt,
  ].join("|");
  return sha512(seq);
}

/** Reverse hash used to verify PayU's callback (server-to-server safe). */
export function payuResponseHash(p: {
  key: string; txnid: string; amount: string; productinfo: string;
  firstname: string; email: string; status: string; salt: string;
  udf1?: string; udf2?: string; udf3?: string; udf4?: string; udf5?: string;
  additionalCharges?: string;
}) {
  const core = [
    p.salt, p.status, "", "", "", "", "",
    u(p.udf5), u(p.udf4), u(p.udf3), u(p.udf2), u(p.udf1),
    p.email, p.firstname, p.productinfo, p.amount, p.txnid, p.key,
  ].join("|");
  const seq = p.additionalCharges ? `${p.additionalCharges}|${core}` : core;
  return sha512(seq);
}
