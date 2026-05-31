"use client";

import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Tags, Users, Ticket,
  Boxes, Star, Mail, Settings, TrendingUp, TrendingDown, IndianRupee,
} from "lucide-react";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "products", label: "Products", icon: Package },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "customers", label: "Customers", icon: Users },
  { key: "coupons", label: "Coupons", icon: Ticket },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "newsletter", label: "Subscribers", icon: Mail },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

const kpis = [
  { label: "Revenue (30d)", value: "₹24,86,400", delta: 12.4, up: true, icon: IndianRupee },
  { label: "Orders (30d)", value: "1,284", delta: 8.1, up: true, icon: ShoppingCart },
  { label: "Conversion rate", value: "3.9%", delta: 0.6, up: true, icon: TrendingUp },
  { label: "Refund rate", value: "1.1%", delta: 0.3, up: false, icon: TrendingDown },
];

const sales = [42, 55, 48, 70, 65, 82, 78, 95, 88, 110, 102, 124];
const recentOrders = [
  { id: "KB7H2K9", customer: "Arjun M.", total: 15999, status: "Confirmed" },
  { id: "KB7H2K8", customer: "Priya K.", total: 10999, status: "Shipped" },
  { id: "KB7H2K7", customer: "Daniel R.", total: 8499, status: "Processing" },
  { id: "KB7H2K6", customer: "Sana T.", total: 11499, status: "Delivered" },
];

export default function AdminPage() {
  const [section, setSection] = useState<(typeof nav)[number]["key"]>("dashboard");

  return (
    <div className="container-wide pt-28 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h-display text-4xl">Admin</h1>
          <p className="mt-1 text-white/50">KraftyBrix control center</p>
        </div>
        <Badge tone="red">Live</Badge>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="space-y-1">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setSection(n.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${section === n.key ? "bg-brand-red text-white" : "text-white/60 hover:bg-white/5"}`}
              >
                <n.icon size={17} /> {n.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="space-y-8">
          {section === "dashboard" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {kpis.map((k) => (
                  <div key={k.label} className="rounded-2xl border border-white/10 bg-ink-800 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-white/45">{k.label}</span>
                      <k.icon size={16} className="text-white/40" />
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold">{k.value}</p>
                    <p className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-green-400" : "text-brand-red"}`}>
                      {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {k.delta}% vs last month
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
                  <h3 className="font-display font-bold">Revenue trend</h3>
                  <div className="mt-6 flex h-44 items-end gap-2">
                    {sales.map((v, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-red/30 to-brand-red transition-all hover:to-brand-blue" style={{ height: `${(v / 124) * 100}%` }} />
                    ))}
                  </div>
                  <p className="mt-3 text-center text-xs text-white/40">Last 12 months</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
                  <h3 className="font-display font-bold">Top products</h3>
                  <ul className="mt-4 space-y-3">
                    {products.slice(0, 4).map((p, i) => (
                      <li key={p.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-3">
                          <span className="text-white/40">{i + 1}</span>
                          <span className="h-6 w-9 rounded" style={{ background: p.bodyColor }} />
                          {p.name}
                        </span>
                        <span className="text-white/55">{p.reviewCount} sold</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
                <h3 className="mb-4 font-display font-bold">Recent orders</h3>
                <Table head={["Order", "Customer", "Total", "Status"]}>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-white/5">
                      <td className="py-3 font-medium">#{o.id}</td>
                      <td className="py-3 text-white/70">{o.customer}</td>
                      <td className="py-3">{formatPrice(o.total)}</td>
                      <td className="py-3"><Badge tone="neutral">{o.status}</Badge></td>
                    </tr>
                  ))}
                </Table>
              </div>
            </>
          )}

          {section === "products" && (
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display font-bold">Products ({products.length})</h3>
                <button className="rounded-full bg-brand-red text-white px-4 py-2 text-sm font-semibold">+ Add product</button>
              </div>
              <Table head={["Product", "Category", "Price", "Stock", "Status"]}>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-white/5">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-white/60">{p.category}</td>
                    <td className="py-3">{formatPrice(p.salePrice ?? p.price)}</td>
                    <td className="py-3">{p.inStock ? "In stock" : "0"}</td>
                    <td className="py-3"><Badge tone={p.inStock ? "blue" : "neutral"}>{p.inStock ? "Active" : "Sold out"}</Badge></td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {section === "orders" && (
            <div className="rounded-2xl border border-white/10 bg-ink-800 p-6">
              <h3 className="mb-4 font-display font-bold">All orders</h3>
              <Table head={["Order", "Customer", "Total", "Status"]}>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-white/5">
                    <td className="py-3 font-medium">#{o.id}</td>
                    <td className="py-3 text-white/70">{o.customer}</td>
                    <td className="py-3">{formatPrice(o.total)}</td>
                    <td className="py-3">
                      <select defaultValue={o.status} className="rounded-lg border border-white/15 bg-ink-900 px-2 py-1 text-xs">
                        {["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {!["dashboard", "products", "orders"].includes(section) && (
            <div className="grid place-items-center rounded-2xl border border-dashed border-white/15 py-24 text-center text-white/50">
              <div>
                <p className="font-display text-lg capitalize text-cream">{section} management</p>
                <p className="mt-2 text-sm">CRUD interface wired to Prisma + server actions. Add your data source to populate.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-white/40">
            {head.map((h) => <th key={h} className="pb-2 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
