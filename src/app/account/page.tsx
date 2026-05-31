"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package, Heart, MapPin, User, Bell, LogOut, ChevronRight,
} from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";

const tabs = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "profile", label: "Profile", icon: User },
  { key: "notifications", label: "Notifications", icon: Bell },
] as const;

const demoOrders = [
  { id: "KB7H2K9", date: "12 May 2026", total: 15999, status: "Delivered", items: "Velocità Rosso" },
  { id: "KB6F1J3", date: "28 Apr 2026", total: 10999, status: "Shipped", items: "R-MAX Godzilla" },
  { id: "KB5D8H1", date: "10 Apr 2026", total: 8499, status: "Processing", items: "Circuit GP-01" },
];

const statusTone: Record<string, "neutral" | "red" | "blue" | "gold"> = {
  Delivered: "blue", Shipped: "gold", Processing: "neutral",
};

export default function AccountPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["key"]>("orders");
  const wishIds = useWishlist((s) => s.ids);
  const wishedProducts = products.filter((p) => wishIds.includes(p.id));

  return (
    <div className="container-wide pt-28 pb-24">
      <h1 className="h-display text-4xl">My Garage</h1>
      <p className="mt-2 text-white/55">Welcome back, collector.</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* sidebar */}
        <aside>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${tab === t.key ? "bg-brand-red text-white" : "text-white/65 hover:bg-white/5"}`}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/45 hover:bg-white/5">
              <LogOut size={18} /> Sign out
            </button>
          </nav>
        </aside>

        {/* content */}
        <div>
          {tab === "orders" && (
            <div className="space-y-3">
              {demoOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink-800 p-5">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">#{o.id}</span>
                      <Badge tone={statusTone[o.status]}>{o.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-white/50">{o.items} · {o.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-display font-bold">{formatPrice(o.total)}</span>
                    <ChevronRight className="text-white/40" size={18} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "wishlist" && (
            wishedProducts.length ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {wishedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <Empty label="Your wishlist is empty." cta />
            )
          )}

          {tab === "addresses" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-ink-800 p-5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Home <Badge tone="red" className="ml-2">Default</Badge></span>
                  <button className="text-sm text-brand-blue hover:underline">Edit</button>
                </div>
                <p className="mt-2 text-sm text-white/55">221B Brick Lane, Bandra West, Mumbai, Maharashtra 400050</p>
              </div>
              <button className="rounded-2xl border border-dashed border-white/20 p-5 text-sm text-white/60 hover:border-white/40">+ Add new address</button>
            </div>
          )}

          {tab === "profile" && (
            <div className="max-w-md space-y-3 rounded-2xl border border-white/10 bg-ink-800 p-6">
              <input defaultValue="Evo Labs" className="w-full rounded-lg border border-white/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red" />
              <input defaultValue="evolabs13@gmail.com" className="w-full rounded-lg border border-white/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red" />
              <input placeholder="Phone" className="w-full rounded-lg border border-white/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red" />
              <button className="rounded-full bg-brand-red text-white px-6 py-3 text-sm font-semibold">Save changes</button>
            </div>
          )}

          {tab === "notifications" && (
            <div className="space-y-3">
              {["Order updates", "New drops & restocks", "Exclusive offers", "Community highlights"].map((n) => (
                <label key={n} className="flex items-center justify-between rounded-2xl border border-white/10 bg-ink-800 p-5">
                  <span className="text-sm">{n}</span>
                  <input type="checkbox" defaultChecked className="h-5 w-5 accent-brand-red" />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Empty({ label, cta }: { label: string; cta?: boolean }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-white/10 py-20 text-center">
      <p className="text-white/55">{label}</p>
      {cta && <Link href="/collection" className="mt-4 text-sm font-semibold text-brand-red hover:underline">Browse the collection →</Link>}
    </div>
  );
}
