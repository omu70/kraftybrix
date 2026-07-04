"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Package, Heart, MapPin, User, Bell, LogOut, Trash2 } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import {
  getMyOrders, updateProfile, listAddresses, addAddress, deleteAddress,
  type MyOrder, type MyAddress,
} from "@/app/actions/auth";

const tabs = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
] as const;

const statusTone = (s: string): "neutral" | "blue" | "green" | "amber" | "red" =>
  s === "DELIVERED" ? "green"
  : s === "SHIPPED" || s === "PROCESSING" ? "blue"
  : s === "CANCELLED" || s === "RETURNED" ? "red"
  : s === "CONFIRMED" ? "neutral" : "amber";

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("orders");

  if (status === "loading") {
    return <div className="container-wide grid min-h-[60vh] place-items-center pt-28 text-black/40">Loading your garage…</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="container-wide grid min-h-[70vh] place-items-center pt-28 text-center">
        <div className="max-w-sm">
          <User size={40} className="mx-auto text-black/25" />
          <h1 className="h-display mt-5 text-3xl">Your garage</h1>
          <p className="mt-3 text-black/55">Sign in to track orders, save addresses and manage your wishlist.</p>
          <Link href="/login"><Button className="mt-6 w-full">Sign in or create account</Button></Link>
          <p className="mt-4 text-xs text-black/40">You can always <Link href="/checkout" className="text-brand-blue hover:underline">check out as a guest</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide pt-28 pb-24">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="h-display text-4xl">My Garage</h1>
          <p className="mt-2 text-black/55">Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}.</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${tab === t.key ? "bg-brand-red text-white" : "text-black/65 hover:bg-black/[0.04]"}`}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
            <button onClick={() => signOut({ callbackUrl: "/" })} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-black/45 hover:bg-black/[0.04]">
              <LogOut size={18} /> Sign out
            </button>
          </nav>
        </aside>

        <div>
          {tab === "orders" && <OrdersTab />}
          {tab === "wishlist" && <WishlistTab />}
          {tab === "addresses" && <AddressesTab />}
          {tab === "profile" && <ProfileTab name={session?.user?.name ?? ""} email={session?.user?.email ?? ""} />}
          {tab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<MyOrder[] | null>(null);
  useEffect(() => { getMyOrders().then(setOrders); }, []);

  if (orders === null) return <div className="py-16 text-center text-black/40">Loading orders…</div>;
  if (orders.length === 0) {
    return (
      <Empty label="No orders yet.">
        <Link href="/collection" className="mt-4 text-sm font-semibold text-brand-red hover:underline">Start your collection →</Link>
      </Empty>
    );
  }
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-black/10 bg-ink-800 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold">#{o.orderNumber}</span>
              <Badge tone={statusTone(o.status)}>{o.status}</Badge>
            </div>
            <span className="font-display font-bold">{formatPrice(o.total)}</span>
          </div>
          <p className="mt-1 text-sm text-black/50">
            {o.items.map((i) => `${i.name}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`).join(", ")} · {fmtDate(o.createdAt)}
          </p>
          {o.codBalance > 0 && (
            <p className="mt-2 text-xs text-black/50">Paid {formatPrice(o.amountPaid)} online · {formatPrice(o.codBalance)} due on delivery</p>
          )}
        </div>
      ))}
    </div>
  );
}

function WishlistTab() {
  const ids = useWishlist((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const items = products.filter((p) => ids.includes(p.id));

  if (!mounted) return null;
  if (items.length === 0) return <Empty label="Your wishlist is empty."><Link href="/collection" className="mt-4 text-sm font-semibold text-brand-red hover:underline">Browse the collection →</Link></Empty>;
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

function AddressesTab() {
  const [rows, setRows] = useState<MyAddress[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => listAddresses().then(setRows);
  useEffect(() => { load(); }, []);

  async function save() {
    setErr(""); setBusy(true);
    try {
      const res = await addAddress(form);
      if (!res.ok) { setErr(res.error ?? "Could not save."); return; }
      setForm({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
      setAdding(false);
      load();
    } finally { setBusy(false); }
  }
  async function remove(id: string) {
    await deleteAddress(id);
    load();
  }

  const inputCls = "w-full rounded-lg border border-black/15 bg-ink-900 px-3 py-2.5 text-sm outline-none focus:border-brand-red";

  return (
    <div className="space-y-4">
      {rows === null ? (
        <div className="py-16 text-center text-black/40">Loading addresses…</div>
      ) : rows.length === 0 && !adding ? (
        <Empty label="No saved addresses yet." />
      ) : (
        rows.map((a) => (
          <div key={a.id} className="rounded-2xl border border-black/10 bg-ink-800 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{a.fullName} · {a.phone}</p>
                <p className="mt-1 text-sm text-black/55">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}</p>
              </div>
              <button onClick={() => remove(a.id)} className="grid h-8 w-8 place-items-center rounded-lg text-brand-red hover:bg-brand-red/10" title="Delete"><Trash2 size={15} /></button>
            </div>
          </div>
        ))
      )}

      {adding ? (
        <div className="space-y-3 rounded-2xl border border-black/10 bg-ink-800 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Full name" className={inputCls} />
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className={inputCls} />
            <input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="Address line 1" className={`${inputCls} sm:col-span-2`} />
            <input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} placeholder="Address line 2 (optional)" className={`${inputCls} sm:col-span-2`} />
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className={inputCls} />
            <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State" className={inputCls} />
            <input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="PIN code" className={inputCls} />
          </div>
          {err && <p className="text-sm text-brand-red">{err}</p>}
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={busy}>{busy ? "Saving…" : "Save address"}</Button>
            <Button size="sm" variant="secondary" onClick={() => { setAdding(false); setErr(""); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="w-full rounded-2xl border border-dashed border-black/20 p-5 text-sm text-black/60 hover:border-black/40">+ Add new address</button>
      )}
    </div>
  );
}

function ProfileTab({ name, email }: { name: string; email: string }) {
  const [n, setN] = useState(name);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  async function save() {
    setMsg(""); setBusy(true);
    try {
      const res = await updateProfile({ name: n });
      setMsg(res.ok ? "Saved." : res.error ?? "Could not save.");
    } finally { setBusy(false); }
  }

  const inputCls = "w-full rounded-lg border border-black/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red";
  return (
    <div className="max-w-md space-y-3 rounded-2xl border border-black/10 bg-ink-800 p-6">
      <label className="block text-xs font-medium uppercase tracking-wider text-black/45">Name</label>
      <input value={n} onChange={(e) => setN(e.target.value)} className={inputCls} />
      <label className="block text-xs font-medium uppercase tracking-wider text-black/45">Email</label>
      <input value={email} disabled className={`${inputCls} opacity-60`} />
      {msg && <p className="text-sm text-black/60">{msg}</p>}
      <Button onClick={save} disabled={busy || !n.trim()}>{busy ? "Saving…" : "Save changes"}</Button>
    </div>
  );
}

function NotificationsTab() {
  const keys = ["Order updates", "New drops & restocks", "Exclusive offers", "Community highlights"];
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const next: Record<string, boolean> = {};
    keys.forEach((k) => { next[k] = localStorage.getItem(`kb-notif-${k}`) !== "off"; });
    setPrefs(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const toggle = (k: string) => {
    const v = !prefs[k];
    setPrefs((p) => ({ ...p, [k]: v }));
    localStorage.setItem(`kb-notif-${k}`, v ? "on" : "off");
  };
  return (
    <div className="space-y-3">
      {keys.map((k) => (
        <label key={k} className="flex items-center justify-between rounded-2xl border border-black/10 bg-ink-800 p-5">
          <span className="text-sm">{k}</span>
          <input type="checkbox" checked={prefs[k] ?? true} onChange={() => toggle(k)} className="h-5 w-5 accent-brand-red" />
        </label>
      ))}
    </div>
  );
}

function Empty({ label, children }: { label: string; children?: React.ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-black/15 py-20 text-center">
      <p className="text-black/55">{label}</p>
      {children}
    </div>
  );
}
