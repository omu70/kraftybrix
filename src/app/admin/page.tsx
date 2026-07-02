"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Ticket, Boxes, Mail,
  Settings, TrendingUp, TrendingDown, IndianRupee, Plus, Pencil, Trash2, X, Search,
} from "lucide-react";
import { categories as catMeta } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  listAdminProducts, saveAdminProduct, deleteAdminProduct, type AdminProduct,
} from "@/app/actions/admin";

const nav = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "customers", label: "Customers", icon: Users },
  { key: "coupons", label: "Coupons", icon: Ticket },
  { key: "subscribers", label: "Subscribers", icon: Mail },
  { key: "settings", label: "Settings", icon: Settings },
] as const;

const kpis = [
  { label: "Revenue (30d)", value: "₹2,48,640", delta: 12.4, up: true, icon: IndianRupee },
  { label: "Orders (30d)", value: "284", delta: 8.1, up: true, icon: ShoppingCart },
  { label: "Conversion", value: "3.9%", delta: 0.6, up: true, icon: TrendingUp },
  { label: "Avg. order", value: "₹1,540", delta: 2.2, up: true, icon: TrendingUp },
];
const recentOrders = [
  { id: "KB7H2K9", customer: "Arjun M.", total: 1699, status: "Confirmed" },
  { id: "KB7H2K8", customer: "Priya K.", total: 999, status: "Shipped" },
  { id: "KB7H2K7", customer: "Daniel R.", total: 699, status: "Processing" },
  { id: "KB7H2K6", customer: "Sana T.", total: 2899, status: "Delivered" },
];

const empty: AdminProduct = {
  name: "", slug: "", category: "Supercars", price: 0, salePrice: null,
  pieces: 0, stock: 0, imageUrl: "", bodyColor: "#FF2D20",
  bestSeller: false, isNew: false, limited: false,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminPage() {
  const [section, setSection] = useState<(typeof nav)[number]["key"]>("dashboard");
  const [rows, setRows] = useState<AdminProduct[]>([]);
  const [mode, setMode] = useState<"db" | "demo">("demo");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    listAdminProducts().then((r) => { setRows(r.rows); setMode(r.mode); });
  }, []);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2600); };

  async function onSave(p: AdminProduct) {
    const res = await saveAdminProduct(p);
    if (!res.ok) { flash(res.error ?? "Error"); return; }
    setRows((cur) => {
      const exists = cur.find((x) => x.id === p.id || x.slug === p.slug);
      return exists ? cur.map((x) => (x.slug === p.slug ? p : x)) : [{ ...p, id: p.id ?? p.slug }, ...cur];
    });
    setEditing(null);
    flash(res.message ?? "Saved");
  }
  async function onDelete(p: AdminProduct) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    await deleteAdminProduct(p.id ?? "");
    setRows((cur) => cur.filter((x) => x.slug !== p.slug));
    flash("Deleted");
  }

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="container-wide pt-28 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h-display text-4xl">Admin</h1>
          <p className="mt-1 text-black/50">KraftyBrix control center</p>
        </div>
        <Badge tone={mode === "db" ? "blue" : "neutral"}>{mode === "db" ? "Live database" : "Demo mode"}</Badge>
      </div>

      {mode === "demo" && (
        <div className="mt-5 rounded-xl border border-brand-blue/30 bg-brand-blue/[0.06] px-4 py-3 text-sm text-black/70">
          Demo mode — changes update the screen but aren't persisted. Add a <code className="font-mono">DATABASE_URL</code> (free Neon tier) and run <code className="font-mono">npm run db:push &amp;&amp; npm run db:seed</code> to go live with real persistence.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside>
          <nav className="space-y-1">
            {nav.map((n) => (
              <button
                key={n.key}
                onClick={() => setSection(n.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${section === n.key ? "bg-brand-red text-white" : "text-black/60 hover:bg-black/[0.04]"}`}
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
                  <div key={k.label} className="rounded-2xl border border-black/10 bg-ink-800 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wider text-black/45">{k.label}</span>
                      <k.icon size={16} className="text-black/40" />
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold">{k.value}</p>
                    <p className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-green-600" : "text-brand-red"}`}>
                      {k.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />} {k.delta}% vs last month
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
                <h3 className="mb-4 font-display font-bold">Recent orders</h3>
                <Table head={["Order", "Customer", "Total", "Status"]}>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t border-black/5">
                      <td className="py-3 font-medium">#{o.id}</td>
                      <td className="py-3 text-black/70">{o.customer}</td>
                      <td className="py-3">{formatPrice(o.total)}</td>
                      <td className="py-3"><Badge tone="neutral">{o.status}</Badge></td>
                    </tr>
                  ))}
                </Table>
              </div>
            </>
          )}

          {section === "products" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display font-bold">Products ({filtered.length})</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="rounded-lg border border-black/15 bg-ink-900 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-red" />
                  </div>
                  <button onClick={() => setEditing({ ...empty })} className="flex items-center gap-1.5 rounded-full bg-brand-red text-white px-4 py-2 text-sm font-semibold">
                    <Plus size={16} /> Add product
                  </button>
                </div>
              </div>
              <Table head={["Product", "Category", "Price", "Stock", "Flags", ""]}>
                {filtered.map((p) => (
                  <tr key={p.slug} className="border-t border-black/5">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-8 w-11 shrink-0 rounded" style={{ background: p.bodyColor }} />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-black/60">{p.category}</td>
                    <td className="py-3">
                      {formatPrice(p.salePrice ?? p.price)}
                      {p.salePrice && <span className="ml-1 text-xs text-black/40 line-through">{formatPrice(p.price)}</span>}
                    </td>
                    <td className="py-3">{p.stock > 0 ? p.stock : <span className="text-brand-red">0</span>}</td>
                    <td className="py-3">
                      <div className="flex gap-1">
                        {p.bestSeller && <Badge tone="red">Best</Badge>}
                        {p.isNew && <Badge tone="blue">New</Badge>}
                        {p.limited && <Badge tone="gold">Ltd</Badge>}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(p)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-black/[0.06]" title="Edit"><Pencil size={15} /></button>
                        <button onClick={() => onDelete(p)} className="grid h-8 w-8 place-items-center rounded-lg text-brand-red hover:bg-brand-red/10" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {section === "orders" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <h3 className="mb-4 font-display font-bold">All orders</h3>
              <Table head={["Order", "Customer", "Total", "Status"]}>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-black/5">
                    <td className="py-3 font-medium">#{o.id}</td>
                    <td className="py-3 text-black/70">{o.customer}</td>
                    <td className="py-3">{formatPrice(o.total)}</td>
                    <td className="py-3">
                      <select defaultValue={o.status} className="rounded-lg border border-black/15 bg-ink-900 px-2 py-1 text-xs">
                        {["Pending", "Confirmed", "Processing", "Shipped", "Delivered"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </Table>
              <p className="mt-4 text-xs text-black/40">Live orders appear here once a database + Razorpay are connected.</p>
            </div>
          )}

          {!["dashboard", "products", "orders"].includes(section) && (
            <div className="grid place-items-center rounded-2xl border border-dashed border-black/15 py-24 text-center text-black/50">
              <div>
                <p className="font-display text-lg capitalize text-cream">{section}</p>
                <p className="mt-2 text-sm">Wired to Prisma + server actions. Connect a database to populate.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {editing && <ProductForm initial={editing} onClose={() => setEditing(null)} onSave={onSave} />}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-cream px-5 py-2.5 text-sm font-medium text-white shadow-card">
          {toast}
        </div>
      )}
    </div>
  );
}

function ProductForm({ initial, onClose, onSave }: { initial: AdminProduct; onClose: () => void; onSave: (p: AdminProduct) => void }) {
  const [f, setF] = useState<AdminProduct>(initial);
  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setF((c) => ({ ...c, [k]: v }));

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ink-900 shadow-card">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h3 className="font-display text-lg font-bold">{initial.id ? "Edit product" : "New product"}</h3>
          <button onClick={onClose}><X /></button>
        </div>
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <Field label="Name">
            <input value={f.name} onChange={(e) => { set("name", e.target.value); if (!initial.id) set("slug", slugify(e.target.value)); }} className={inputCls} />
          </Field>
          <Field label="Slug (URL)"><input value={f.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} /></Field>
          <Field label="Category">
            <select value={f.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              {catMeta.map((c) => <option key={c.slug}>{c.name}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="MRP (₹)"><input type="number" value={f.price} onChange={(e) => set("price", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Sale price (₹)"><input type="number" value={f.salePrice ?? ""} onChange={(e) => set("salePrice", e.target.value ? Number(e.target.value) : null)} className={inputCls} /></Field>
            <Field label="Pieces"><input type="number" value={f.pieces} onChange={(e) => set("pieces", Number(e.target.value))} className={inputCls} /></Field>
            <Field label="Stock"><input type="number" value={f.stock} onChange={(e) => set("stock", Number(e.target.value))} className={inputCls} /></Field>
          </div>
          <Field label="Image URL"><input value={f.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://…" className={inputCls} /></Field>
          <Field label="Body colour">
            <div className="flex items-center gap-2">
              <input type="color" value={f.bodyColor} onChange={(e) => set("bodyColor", e.target.value)} className="h-10 w-14 rounded-lg border border-black/15 bg-ink-800" />
              <input value={f.bodyColor} onChange={(e) => set("bodyColor", e.target.value)} className={inputCls} />
            </div>
          </Field>
          <div className="flex flex-wrap gap-4 pt-1">
            {(["bestSeller", "isNew", "limited"] as const).map((k) => (
              <label key={k} className="flex items-center gap-2 text-sm capitalize">
                <input type="checkbox" checked={!!f[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-brand-red" />
                {k === "isNew" ? "New" : k}
              </label>
            ))}
          </div>
        </div>
        <div className="border-t border-black/10 px-6 py-4">
          <button onClick={() => onSave(f)} disabled={!f.name || !f.slug} className="w-full rounded-full bg-brand-red text-white py-3 text-sm font-semibold disabled:opacity-50">
            Save product
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border border-black/15 bg-ink-800 px-3 py-2.5 text-sm outline-none focus:border-brand-red";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-black/45">{label}</span>
      {children}
    </label>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-black/40">
            {head.map((h, i) => <th key={i} className="pb-2 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
