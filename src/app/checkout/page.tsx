"use client";

import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { Lock, Tag, Check, CreditCard, Banknote } from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { applyCoupon, createOrder, verifyPayment } from "@/app/actions/checkout";
import { track } from "@/components/analytics";

type Method = "RAZORPAY" | "COD";

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
  const [method, setMethod] = useState<Method>("RAZORPAY");
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: "", phone: "", email: "", line1: "", line2: "", city: "", state: "", pincode: "",
  });

  const discount = applied?.discount ?? 0;
  const shipping = subtotal - discount >= 9999 ? 0 : 199;
  const total = Math.max(0, subtotal - discount + shipping);

  async function onApplyCoupon() {
    setCouponErr("");
    const res = await applyCoupon(coupon, subtotal);
    if (res.ok) setApplied({ code: res.code, discount: res.discount });
    else { setApplied(null); setCouponErr(res.error); }
  }

  async function placeOrder() {
    setPlacing(true);
    try {
      const res = await createOrder({
        address: form,
        lines: lines.map((l) => ({ productId: l.productId, name: l.name, price: l.price, qty: l.qty })),
        couponCode: applied?.code,
        paymentMethod: method,
      });
      if (!res.ok) { alert(res.error); return; }

      if (res.method === "COD") {
        track("purchase", { value: res.amount, method: "COD" });
        clear();
        router.push(`/order-confirmed?order=${res.orderNumber}`);
        return;
      }

      // Demo mode (no Razorpay keys configured): simulate a successful test payment.
      if ("demo" in res && res.demo) {
        track("purchase", { value: res.amount, method: "RAZORPAY_DEMO" });
        clear();
        router.push(`/order-confirmed?order=${res.orderNumber}&demo=1`);
        return;
      }

      // Razorpay flow (TEST or LIVE) — opens the hosted checkout widget.
      // @ts-expect-error injected by script
      const rzp = new window.Razorpay({
        key: res.keyId,
        amount: res.amount * 100,
        currency: "INR",
        name: "KraftyBrix",
        description: `Order ${res.orderNumber}`,
        order_id: res.razorpayOrderId,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: "#FF2D20" },
        handler: async (resp: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verifyPayment({
            razorpayOrderId: resp.razorpay_order_id,
            razorpayPaymentId: resp.razorpay_payment_id,
            signature: resp.razorpay_signature,
          });
          track("purchase", { value: res.amount, method: "RAZORPAY" });
          clear();
          router.push(`/order-confirmed?order=${res.orderNumber}`);
        },
      });
      rzp.open();
    } finally {
      setPlacing(false);
    }
  }

  const formValid = useMemo(
    () => form.fullName && form.phone && form.email && form.line1 && form.city && form.state && form.pincode,
    [form]
  );

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

      <div className="mt-10 grid gap-10 pb-24 lg:grid-cols-[1fr_400px]">
        {/* form */}
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Shipping address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="fullName" placeholder="Full name" form={form} setForm={setForm} />
              <Field name="phone" placeholder="Phone" form={form} setForm={setForm} />
              <Field name="email" placeholder="Email" form={form} setForm={setForm} className="sm:col-span-2" />
              <Field name="line1" placeholder="Address line 1" form={form} setForm={setForm} className="sm:col-span-2" />
              <Field name="line2" placeholder="Address line 2 (optional)" form={form} setForm={setForm} className="sm:col-span-2" />
              <Field name="city" placeholder="City" form={form} setForm={setForm} />
              <Field name="state" placeholder="State" form={form} setForm={setForm} />
              <Field name="pincode" placeholder="PIN code" form={form} setForm={setForm} />
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-display text-xl font-bold">Payment method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <MethodCard active={method === "RAZORPAY"} onClick={() => setMethod("RAZORPAY")} icon={CreditCard} title="Pay online" sub="UPI · Cards · Netbanking via Razorpay" />
              <MethodCard active={method === "COD"} onClick={() => setMethod("COD")} icon={Banknote} title="Cash on delivery" sub="Pay when it arrives" />
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {lines.map((l) => (
                <li key={l.productId} className="flex justify-between text-sm">
                  <span className="text-black/70">{l.name} × {l.qty}</span>
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
            </dl>

            <Button size="lg" className="mt-6 w-full" disabled={!formValid || placing} onClick={placeOrder}>
              {placing ? "Processing…" : method === "COD" ? `Place order · ${formatPrice(total)}` : `Pay ${formatPrice(total)}`}
            </Button>
            {!formValid && <p className="mt-2 text-center text-xs text-black/40">Fill in your shipping details to continue</p>}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ name, placeholder, form, setForm, className }: { name: keyof FormState; placeholder: string; form: FormState; setForm: Dispatch<SetStateAction<FormState>>; className?: string }) {
  return (
    <input
      value={form[name]}
      onChange={(e) => setForm({ ...form, [name]: e.target.value })}
      placeholder={placeholder}
      className={`rounded-lg border border-black/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red ${className ?? ""}`}
    />
  );
}

function MethodCard({ active, onClick, icon: Icon, title, sub }: { active: boolean; onClick: () => void; icon: typeof CreditCard; title: string; sub: string }) {
  return (
    <button onClick={onClick} className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${active ? "border-brand-red bg-brand-red/10" : "border-black/15 hover:border-black/30"}`}>
      <Icon size={20} className={active ? "text-brand-red" : "text-black/60"} />
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
