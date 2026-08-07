"use client";

import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Lock, Tag, Check, CreditCard, Wallet } from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ADVANCE_FEE, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { applyCoupon, createOrder, verifyPayment, createPayuOrder, paymentConfig } from "@/app/actions/checkout";
import { track } from "@/components/analytics";

type Method = "ONLINE" | "PARTIAL_COD";
type Gateway = "razorpay" | "payu";

/** Build a hidden form and POST the customer to PayU's hosted checkout. */
function postToPayU(action: string, params: Record<string, string>) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  for (const [k, v] of Object.entries(params)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = String(v ?? "");
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const router = useRouter();
  const subtotal = cartSubtotal(lines);

  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);
  const [couponErr, setCouponErr] = useState("");
  const [method, setMethod] = useState<Method>("PARTIAL_COD");
  const [gateway, setGateway] = useState<Gateway>("payu");
  const [placing, setPlacing] = useState(false);
  const [gw, setGw] = useState<{ payu: boolean; razorpay: boolean; live: boolean } | null>(null);

  // Ask the server which gateways are configured (runtime, not build time).
  useEffect(() => {
    paymentConfig()
      .then((c) => { setGw(c); setGateway(c.payu ? "payu" : "razorpay"); })
      .catch(() => setGw({ payu: false, razorpay: false, live: false }));
  }, []);

  const payuAvailable = gw?.payu ?? false;
  const bothGateways = !!gw?.payu && !!gw?.razorpay;
  const noGateway = gw !== null && !gw.payu && !gw.razorpay;
  const [form, setForm] = useState<FormState>({
    fullName: "", phone: "", email: "", line1: "", line2: "", city: "", state: "", pincode: "",
  });

  const discount = applied?.discount ?? 0;
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);

  // What the customer pays online now vs on delivery.
  const payNow = method === "PARTIAL_COD" ? Math.min(ADVANCE_FEE, total) : total;
  const codBalance = method === "PARTIAL_COD" ? Math.max(0, total - payNow) : 0;

  const [payuFailed, setPayuFailed] = useState(false);

  // Meta Pixel: InitiateCheckout when the checkout opens with items in the cart.
  useEffect(() => {
    if (lines.length > 0) track("begin_checkout", { value: total });
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("payu") === "failed") {
      setPayuFailed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onApplyCoupon() {
    setCouponErr("");
    const res = await applyCoupon(coupon, subtotal);
    if (res.ok) setApplied({ code: res.code, discount: res.discount });
    else { setApplied(null); setCouponErr(res.error); }
  }

  async function placeOrder() {
    setPlacing(true);
    track("add_payment_info", { value: total, method }); // Meta Pixel: AddPaymentInfo

    const orderInput = {
      address: form,
      lines: lines.map((l) => ({ productId: l.productId, name: [l.name, l.color, l.material].filter(Boolean).join(" · "), price: l.price, qty: l.qty })),
      couponCode: applied?.code,
      paymentMethod: method,
    };

    // PayU: create the order, then redirect the browser to PayU's hosted page.
    if (gateway === "payu" && payuAvailable) {
      try {
        const res = await createPayuOrder(orderInput, window.location.origin);
        if (!res.ok) { alert(res.error); setPlacing(false); return; }
        postToPayU(res.action, res.params); // navigates away; cart clears on the confirmation page
      } catch {
        alert("Could not start PayU payment. Please try again.");
        setPlacing(false);
      }
      return;
    }

    try {
      const res = await createOrder({
        address: form,
        lines: lines.map((l) => ({ productId: l.productId, name: [l.name, l.color, l.material].filter(Boolean).join(" · "), price: l.price, qty: l.qty })),
        couponCode: applied?.code,
        paymentMethod: method,
      });
      if (!res.ok) { alert(res.error); return; }

      const confirmUrl = `/order-confirmed?order=${res.orderNumber}&paid=${res.payNow}&due=${res.codBalance}`;

      // Demo mode (no Razorpay keys yet): simulate the online payment.
      if ("demo" in res && res.demo) {
        track("purchase", { value: res.total, method: `${method}_DEMO` });
        clear();
        router.push(`${confirmUrl}&demo=1`);
        return;
      }

      // Razorpay flow (TEST or LIVE) — charges payNow (full total, or ₹99 advance).
      // @ts-expect-error injected by script
      const rzp = new window.Razorpay({
        key: res.keyId,
        amount: res.payNow * 100,
        currency: "INR",
        name: "KraftyBrix",
        description: method === "PARTIAL_COD" ? `Order ${res.orderNumber} — ₹${ADVANCE_FEE} advance` : `Order ${res.orderNumber}`,
        order_id: res.razorpayOrderId,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: "#FF2D20" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verifyPayment({
            razorpayOrderId: resp.razorpay_order_id,
            razorpayPaymentId: resp.razorpay_payment_id,
            signature: resp.razorpay_signature,
          });
          track("purchase", { value: res.total, method });
          clear();
          router.push(confirmUrl);
        },
      });
      rzp.open();
    } finally {
      setPlacing(false);
    }
  }

  const REQUIRED: { key: keyof FormState; label: string }[] = [
    { key: "fullName", label: "Full name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "line1", label: "Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "pincode", label: "PIN code" },
  ];
  const missing = REQUIRED.filter((f) => !String(form[f.key] ?? "").trim());
  const formValid = missing.length === 0;

  if (lines.length === 0) {
    return (
      <div className="container-wide grid min-h-[60vh] place-items-center pt-28 text-center">
        <div>
          <p className="text-black/60">Your cart is empty.</p>
          <Link href="/collection"><Button className="mt-6">Browse the collection</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide pt-28">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <h1 className="h-display text-4xl">Checkout</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-black/50">
        <Lock size={14} /> Secure 256-bit encrypted checkout
      </p>
      {payuFailed && (
        <div className="mt-4 rounded-xl border border-brand-red/40 bg-brand-red/[0.06] px-4 py-3 text-sm text-black/75">
          Your payment didn&apos;t go through and you were not charged. Please try again or choose another payment method.
        </div>
      )}
      {noGateway && (
        <div className="mt-4 rounded-xl border border-amber-400/50 bg-amber-400/[0.10] px-4 py-3 text-sm text-black/75">
          <b>Payments aren&apos;t configured yet.</b> Add <code className="font-mono">PAYU_MERCHANT_KEY</code> and{" "}
          <code className="font-mono">PAYU_SALT</code> in your hosting environment variables, then rebuild and restart.
          Orders placed now are recorded but not charged.
        </div>
      )}

      <div className="mt-10 grid gap-10 pb-24 lg:grid-cols-[1fr_400px]">
        {/* form */}
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Shipping address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="fullName" placeholder="Full name *" form={form} setForm={setForm} required />
              <Field name="phone" placeholder="Phone *" form={form} setForm={setForm} required />
              <Field name="email" placeholder="Email *" form={form} setForm={setForm} className="sm:col-span-2" required />
              <Field name="line1" placeholder="Address line 1 *" form={form} setForm={setForm} className="sm:col-span-2" required />
              <Field name="line2" placeholder="Address line 2 (optional)" form={form} setForm={setForm} className="sm:col-span-2" />
              <Field name="city" placeholder="City *" form={form} setForm={setForm} required />
              <Field name="state" placeholder="State *" form={form} setForm={setForm} required />
              <Field name="pincode" placeholder="PIN code *" form={form} setForm={setForm} required />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Payment method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard
                active={method === "PARTIAL_COD"}
                onClick={() => setMethod("PARTIAL_COD")}
                icon={Wallet}
                title={`Partial COD — pay ${formatPrice(ADVANCE_FEE)} now`}
                sub="Confirm with a small advance, pay the rest on delivery"
                badge="Recommended"
              />
              <MethodCard
                active={method === "ONLINE"}
                onClick={() => setMethod("ONLINE")}
                icon={CreditCard}
                title="Pay online"
                sub="UPI · Cards · Netbanking"
              />
            </div>
            {method === "PARTIAL_COD" && (
              <p className="mt-3 text-xs text-black/50">
                Pay just {formatPrice(payNow)} now to lock your order — the balance of {formatPrice(codBalance)} is collected in cash when it arrives.
              </p>
            )}

            {bothGateways && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-black/45">Pay securely via</p>
                <div className="flex gap-2">
                  {(["payu", "razorpay"] as Gateway[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGateway(g)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${gateway === g ? "border-brand-red bg-brand-red/10 text-brand-red" : "border-black/15 hover:border-black/30"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.lineId} className="flex justify-between gap-2 text-sm">
                  <span className="text-black/70">
                    {l.name} × {l.qty}
                    {(l.color || l.material) && <span className="text-black/45"> ({[l.color, l.material].filter(Boolean).join(", ")})</span>}
                  </span>
                  <span>{formatPrice(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 border-t border-black/10 pt-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Coupon code (try BRICK10)"
                    className="w-full rounded-lg border border-black/15 bg-ink-900 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-red"
                  />
                </div>
                <Button variant="secondary" size="sm" onClick={onApplyCoupon}>Apply</Button>
              </div>
              {applied && <p className="mt-2 flex items-center gap-1 text-xs text-green-400"><Check size={13} /> {applied.code} applied</p>}
              {couponErr && <p className="mt-2 text-xs text-brand-red">{couponErr}</p>}
            </div>

            <dl className="mt-5 space-y-2 border-t border-black/10 pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              {discount > 0 && <Row label="Discount" value={`− ${formatPrice(discount)}`} green />}
              <Row label="Shipping" value={shipping === 0 ? "Free" : formatPrice(shipping)} />
              <div className="flex justify-between border-t border-black/10 pt-3 text-base font-bold">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
              {method === "PARTIAL_COD" && (
                <div className="mt-2 space-y-2 rounded-xl bg-brand-red/[0.06] p-3">
                  <div className="flex justify-between font-semibold text-cream">
                    <span>Pay now</span><span>{formatPrice(payNow)}</span>
                  </div>
                  <div className="flex justify-between text-black/60">
                    <span>Due on delivery</span><span>{formatPrice(codBalance)}</span>
                  </div>
                </div>
              )}
            </dl>

            <Button size="lg" className="mt-6 w-full" disabled={!formValid || placing} onClick={placeOrder}>
              {placing ? "Processing…" : method === "PARTIAL_COD" ? `Pay ${formatPrice(payNow)} to confirm` : `Pay ${formatPrice(total)}`}
            </Button>
            {!formValid && (
              <p className="mt-2 text-center text-xs text-black/55">
                Still needed:{" "}
                <span className="font-semibold text-brand-red">
                  {missing.map((m) => m.label).join(", ")}
                </span>
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ name, placeholder, form, setForm, className, required }: { name: keyof FormState; placeholder: string; form: FormState; setForm: Dispatch<SetStateAction<FormState>>; className?: string; required?: boolean }) {
  const [touched, setTouched] = useState(false);
  const empty = required && !String(form[name] ?? "").trim();
  return (
    <input
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      onBlur={() => setTouched(true)}
      placeholder={placeholder}
      aria-required={required}
      className={`rounded-lg border bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red ${
        touched && empty ? "border-brand-red/60 bg-brand-red/[0.04]" : "border-black/15"
      } ${className ?? ""}`}
    />
  );
}

function MethodCard({ active, onClick, icon: Icon, title, sub, badge }: { active: boolean; onClick: () => void; icon: typeof CreditCard; title: string; sub: string; badge?: string }) {
  return (
    <button onClick={onClick} className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition ${badge ? "pr-24" : ""} ${active ? "border-brand-red bg-brand-red/10" : "border-black/15 hover:border-black/30"}`}>
      {badge && (
        <span className="absolute right-3 top-3 rounded-full bg-brand-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">{badge}</span>
      )}
      <Icon size={20} className={`mt-0.5 shrink-0 ${active ? "text-brand-red" : "text-black/60"}`} />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-xs text-black/50">{sub}</p>
      </div>
    </button>
  );
}

function Row({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-black/55">{label}</dt>
      <dd className={green ? "text-green-400" : ""}>{value}</dd>
    </div>
  );
}
