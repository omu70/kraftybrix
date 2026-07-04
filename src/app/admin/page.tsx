"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Users, Ticket, Boxes, Mail,
  Settings, TrendingUp, IndianRupee, Plus, Pencil, Trash2, X, Search,
  Wallet, CreditCard, AlertTriangle, Database, CheckCircle2, Truck,
} from "lucide-react";
import { categories as catMeta } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ADVANCE_FEE, FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, COUPONS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import {
  listAdminProducts, saveAdminProduct, deleteAdminProduct, seedCatalogue,
  listAdminOrders, updateOrderStatus, adminStats, listSubscribers, getConfigStatus,
  type AdminProduct, type AdminOrder, type OrderStatus, type AdminStats,
} from "@/app/actions/admin";
import { adminLogout } from "@/app/actions/admin-auth";
import { useRouter } from "next/navigation";

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

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED",
];

const statusTone = (s: string): "neutral" | "blue" | "green" | "amber" | "red" =>
  s === "DELIVERED" ? "green"
  : s === "SHIPPED" || s === "PROCESSING" ? "blue"
  : s === "CONFIRMED" ? "neutral"
  : s === "CANCELLED" || s === "RETURNED" ? "red"
  : "amber"; // PENDING

const payTone = (s: string) => (s === "PAID" ? "green" : s === "PARTIAL" ? "amber" : "neutral");
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });

const empty: AdminProduct = {
  name: "", slug: "", brand: "KraftyBrix", category: "Supercars", tagline: "", description: "",
  price: 0, salePrice: null, pieces: 0, buildHours: 0, difficulty: "Intermediate", ageRange: "14+", scale: "1:10",
  stock: 0, rating: 0, reviewCount: 0, imageUrl: "", gallery: [], whatsIncluded: [],
  bodyColor: "#FF2D20", accentColor: "#111111", bestSeller: false, isNew: false, limited: false,
};

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

type Config = Awaited<ReturnType<typeof getConfigStatus>>;

export default function AdminPage() {
  const router = useRouter();
  const [section, setSection] = useState<(typeof nav)[number]["key"]>("dashboard");
  const [rows, setRows] = useState<AdminProduct[]>([]);
  const [mode, setMode] = useState<"db" | "demo">("demo");
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [subs, setSubs] = useState<{ email: string; name: string | null; createdAt: string }[]>([]);
  const [config, setConfig] = useState<Config | null>(null);
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    listAdminProducts().then((r) => { setRows(r.rows); setMode(r.mode); });
    listAdminOrders().then((r) => setOrders(r.rows));
    adminStats().then((r) => setStats(r.stats));
    listSubscribers().then((r) => setSubs(r.rows));
    getConfigStatus().then(setConfig);
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
  async function onStatusChange(o: AdminOrder, status: OrderStatus) {
    setOrders((cur) => cur.map((x) => (x.id === o.id ? { ...x, status } : x)));
    const res = await updateOrderStatus(o.id, status);
    flash(res.ok ? `${o.orderNumber} → ${status.toLowerCase()}` : res.error ?? "Error");
  }

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase()));
  const inventory = useMemo(() => [...rows].sort((a, b) => a.stock - b.stock), [rows]);
  const lowStock = rows.filter((r) => r.stock <= 5).length;
  const pendingOrders = orders.filter((o) => ["PENDING", "CONFIRMED", "PROCESSING"].includes(o.status)).length;

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; orders: number; spent: number; last: string }>();
    for (const o of orders) {
      const key = o.email || o.customer;
      const cur = map.get(key) ?? { name: o.customer, email: o.email, phone: o.phone, orders: 0, spent: 0, last: o.createdAt };
      cur.orders += 1;
      cur.spent += o.total;
      if (o.createdAt > cur.last) cur.last = o.createdAt;
      map.set(key, cur);
    }
    return [...map.values()].sort((a, b) => b.spent - a.spent);
  }, [orders]);

  return (
    <div className="container-wide pt-28 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="h-display text-4xl">Admin</h1>
          <p className="mt-1 text-black/50">KraftyBrix control center</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={mode === "db" ? "green" : "neutral"}>{mode === "db" ? "Live database" : "Demo mode"}</Badge>
          <button
            onClick={async () => { await adminLogout(); router.push("/admin/login"); }}
            className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.04]"
          >
            Sign out
          </button>
        </div>
      </div>

      {mode === "demo" && (
        <div className="mt-5 rounded-xl border border-amber-400/40 bg-amber-400/[0.08] px-4 py-3 text-sm text-black/70">
          {config?.database ? (
            <>Your database is connected, but the tables aren&apos;t created yet. <b>Redeploy on Vercel</b> — the build creates them automatically — then refresh this page. Anything you add right now won&apos;t be saved.</>
          ) : (
            <>Demo mode — you&apos;re seeing sample data. Add a <code className="font-mono">DATABASE_URL</code> (free Neon tier) in Vercel and redeploy to switch to your live store automatically.</>
          )}
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
          {/* ─────────── Dashboard ─────────── */}
          {section === "dashboard" && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Kpi label="Revenue collected" value={stats ? formatPrice(stats.revenue) : "—"} icon={IndianRupee} hint="Paid online" />
                <Kpi label="Orders" value={stats ? String(stats.orders) : "—"} icon={ShoppingCart} hint={`${pendingOrders} need action`} />
                <Kpi label="Avg. order value" value={stats ? formatPrice(stats.aov) : "—"} icon={TrendingUp} hint="Across all orders" />
                <Kpi label="COD to collect" value={stats ? formatPrice(stats.pendingCod) : "—"} icon={Wallet} hint="Cash due on delivery" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <MiniStat label="Gross sales" value={stats ? formatPrice(stats.grossValue) : "—"} />
                <MiniStat label="Low / out of stock" value={String(lowStock)} warn={lowStock > 0} />
                <MiniStat label="Subscribers" value={String(subs.length)} />
              </div>

              <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-display font-bold">Recent orders</h3>
                  <button onClick={() => setSection("orders")} className="text-sm text-brand-red hover:underline">View all</button>
                </div>
                {orders.length === 0 ? (
                  <Empty>No orders yet. They&apos;ll appear here in real time.</Empty>
                ) : (
                  <Table head={["Order", "Customer", "Payment", "Total", "Status"]}>
                    {orders.slice(0, 6).map((o) => (
                      <tr key={o.id} className="border-t border-black/5">
                        <td className="py-3 font-medium">#{o.orderNumber}</td>
                        <td className="py-3 text-black/70">{o.customer}</td>
                        <td className="py-3"><Badge tone={payTone(o.paymentStatus)}>{o.paymentMethod === "PARTIAL_COD" ? "Partial" : "Online"}</Badge></td>
                        <td className="py-3">{formatPrice(o.total)}</td>
                        <td className="py-3"><Badge tone={statusTone(o.status)}>{o.status}</Badge></td>
                      </tr>
                    ))}
                  </Table>
                )}
              </div>
            </>
          )}

          {/* ─────────── Products ─────────── */}
          {section === "products" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display font-bold">Products ({filtered.length})</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" className="rounded-lg border border-black/15 bg-ink-900 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-red" />
                  </div>
                  {mode === "db" && (
                    <button
                      onClick={async () => {
                        const res = await seedCatalogue();
                        if (res.ok) { const r = await listAdminProducts(); setRows(r.rows); flash(`Loaded ${res.count} products`); }
                        else flash(res.error ?? "Error");
                      }}
                      className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium hover:bg-black/[0.04]"
                    >
                      Load sample products
                    </button>
                  )}
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
                        {p.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.imageUrl} alt="" className="h-8 w-11 shrink-0 rounded bg-white object-cover" />
                        ) : (
                          <span className="h-8 w-11 shrink-0 rounded" style={{ background: p.bodyColor }} />
                        )}
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

          {/* ─────────── Orders ─────────── */}
          {section === "orders" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <h3 className="mb-4 font-display font-bold">All orders ({orders.length})</h3>
              {orders.length === 0 ? (
                <Empty>No orders yet.</Empty>
              ) : (
                <Table head={["Order", "Customer", "Payment", "Total", "Status"]}>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t border-black/5 align-top">
                      <td className="py-3">
                        <div className="font-medium">#{o.orderNumber}</div>
                        <div className="text-xs text-black/45">{fmtDate(o.createdAt)}</div>
                      </td>
                      <td className="py-3">
                        <div className="text-black/80">{o.customer}</div>
                        <div className="text-xs text-black/45">{o.email || o.phone}</div>
                      </td>
                      <td className="py-3">
                        <Badge tone={payTone(o.paymentStatus)}>{o.paymentMethod === "PARTIAL_COD" ? "Partial COD" : "Online"}</Badge>
                        {o.codBalance > 0 && (
                          <div className="mt-1 text-xs text-black/50">Paid {formatPrice(o.amountPaid)} · Due {formatPrice(o.codBalance)}</div>
                        )}
                      </td>
                      <td className="py-3 font-medium">{formatPrice(o.total)}</td>
                      <td className="py-3">
                        <select
                          value={o.status}
                          onChange={(e) => onStatusChange(o, e.target.value as OrderStatus)}
                          className="rounded-lg border border-black/15 bg-ink-900 px-2 py-1.5 text-xs outline-none focus:border-brand-red"
                        >
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </Table>
              )}
              {mode === "demo" && <p className="mt-4 text-xs text-black/40">Sample orders shown. Real orders appear here automatically once your database is connected.</p>}
            </div>
          )}

          {/* ─────────── Inventory ─────────── */}
          {section === "inventory" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display font-bold">Inventory</h3>
                {lowStock > 0 && (
                  <span className="flex items-center gap-1.5 text-sm text-amber-600">
                    <AlertTriangle size={15} /> {lowStock} low / out of stock
                  </span>
                )}
              </div>
              <Table head={["Product", "Category", "Stock", "Status", ""]}>
                {inventory.map((p) => (
                  <tr key={p.slug} className="border-t border-black/5">
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-black/60">{p.category}</td>
                    <td className="py-3">{p.stock}</td>
                    <td className="py-3">
                      {p.stock === 0 ? <Badge tone="red">Out of stock</Badge>
                        : p.stock <= 5 ? <Badge tone="amber">Low</Badge>
                        : <Badge tone="green">In stock</Badge>}
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => setEditing(p)} className="text-sm text-brand-red hover:underline">Adjust</button>
                    </td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {/* ─────────── Customers ─────────── */}
          {section === "customers" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <h3 className="mb-4 font-display font-bold">Customers ({customers.length})</h3>
              {customers.length === 0 ? (
                <Empty>No customers yet.</Empty>
              ) : (
                <Table head={["Customer", "Contact", "Orders", "Lifetime value", "Last order"]}>
                  {customers.map((c) => (
                    <tr key={c.email} className="border-t border-black/5">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3 text-black/60">{c.email || c.phone}</td>
                      <td className="py-3">{c.orders}</td>
                      <td className="py-3 font-medium">{formatPrice(c.spent)}</td>
                      <td className="py-3 text-black/60">{fmtDate(c.last)}</td>
                    </tr>
                  ))}
                </Table>
              )}
            </div>
          )}

          {/* ─────────── Coupons ─────────── */}
          {section === "coupons" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <h3 className="mb-1 font-display font-bold">Active coupons</h3>
              <p className="mb-4 text-sm text-black/50">These codes work at checkout right now.</p>
              <Table head={["Code", "Type", "Discount"]}>
                {Object.entries(COUPONS).map(([code, c]) => (
                  <tr key={code} className="border-t border-black/5">
                    <td className="py-3 font-mono font-medium">{code}</td>
                    <td className="py-3 text-black/60">{c.type === "PERCENT" ? "Percentage" : "Flat"}</td>
                    <td className="py-3">{c.type === "PERCENT" ? `${c.value}% off` : `${formatPrice(c.value)} off`}</td>
                  </tr>
                ))}
              </Table>
            </div>
          )}

          {/* ─────────── Subscribers ─────────── */}
          {section === "subscribers" && (
            <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
              <h3 className="mb-4 font-display font-bold">Newsletter subscribers ({subs.length})</h3>
              {subs.length === 0 ? (
                <Empty>No subscribers yet.</Empty>
              ) : (
                <Table head={["Name", "Email", "Joined"]}>
                  {subs.map((s) => (
                    <tr key={s.email} className="border-t border-black/5">
                      <td className="py-3 font-medium">{s.name ?? "—"}</td>
                      <td className="py-3 text-black/60">{s.email}</td>
                      <td className="py-3 text-black/60">{fmtDate(s.createdAt)}</td>
                    </tr>
                  ))}
                </Table>
              )}
            </div>
          )}

          {/* ─────────── Settings ─────────── */}
          {section === "settings" && config && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
                <h3 className="mb-4 font-display font-bold">Go-live status</h3>
                <div className="space-y-3">
                  <StatusRow icon={Database} label="Database (orders + products)" ok={config.database} okText="Connected" offText="Not connected — add DATABASE_URL" />
                  <StatusRow icon={CreditCard} label="Razorpay payments" ok={config.razorpay} okText="Configured" offText="Test mode — add Razorpay keys" />
                  <StatusRow icon={Mail} label="Order emails (Resend)" ok={config.email} okText="Configured" offText="Optional — add RESEND_API_KEY" />
                  <StatusRow icon={CheckCircle2} label="Admin login protection" ok={config.adminProtected} okText="Protected" offText="Set ADMIN_SESSION to lock /admin" />
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-ink-800 p-6">
                <h3 className="mb-4 font-display font-bold">Store configuration</h3>
                <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                  <ConfigRow icon={Wallet} label="Partial COD advance" value={formatPrice(ADVANCE_FEE)} />
                  <ConfigRow icon={Truck} label="Free shipping over" value={formatPrice(FREE_SHIPPING_THRESHOLD)} />
                  <ConfigRow icon={Truck} label="Flat shipping fee" value={formatPrice(SHIPPING_FEE)} />
                  <ConfigRow icon={Settings} label="Store URL" value={config.siteUrl || "—"} />
                </dl>
                <p className="mt-4 text-xs text-black/40">These values are set in <code className="font-mono">src/lib/constants.ts</code> and Vercel environment variables.</p>
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

/* ───────────────────────── small UI helpers ───────────────────────── */

function Kpi({ label, value, icon: Icon, hint }: { label: string; value: string; icon: typeof IndianRupee; hint?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-ink-800 p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-black/45">{label}</span>
        <Icon size={16} className="text-black/40" />
      </div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-black/45">{hint}</p>}
    </div>
  );
}

function MiniStat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-ink-800 p-5">
      <span className="text-xs uppercase tracking-wider text-black/45">{label}</span>
      <p className={`mt-2 font-display text-xl font-bold ${warn ? "text-amber-600" : ""}`}>{value}</p>
    </div>
  );
}

function StatusRow({ icon: Icon, label, ok, okText, offText }: { icon: typeof Database; label: string; ok: boolean; okText: string; offText: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2.5 text-sm text-black/70"><Icon size={16} className="text-black/45" /> {label}</span>
      <Badge tone={ok ? "green" : "amber"}>{ok ? okText : offText}</Badge>
    </div>
  );
}

function ConfigRow({ icon: Icon, label, value }: { icon: typeof Wallet; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-ink-900 px-4 py-3">
      <span className="flex items-center gap-2 text-black/60"><Icon size={15} className="text-black/40" /> {label}</span>
      <span className="font-medium text-cream">{value}</span>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="grid place-items-center rounded-xl border border-dashed border-black/15 py-16 text-center text-sm text-black/50">{children}</div>;
}

function ProductForm({ initial, onClose, onSave }: { initial: AdminProduct; onClose: () => void; onSave: (p: AdminProduct) => void }) {
  const [f, setF] = useState<AdminProduct>(initial);
  const set = <K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) => setF((c) => ({ ...c, [k]: v }));
  const discount = f.salePrice && f.price ? Math.round((1 - f.salePrice / f.price) * 100) : 0;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-ink-900 shadow-card">
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <h3 className="font-display text-lg font-bold">{initial.id ? "Edit product" : "New product"}</h3>
          <button onClick={onClose} aria-label="Close"><X /></button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
          <FormSection title="Basics">
            <Field label="Product name *">
              <input value={f.name} onChange={(e) => { set("name", e.target.value); if (!initial.id) set("slug", slugify(e.target.value)); }} placeholder="e.g. Lamborghini Sián Roadster" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Brand"><input value={f.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Lamborghini" className={inputCls} /></Field>
              <Field label="Category">
                <select value={f.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                  {catMeta.map((c) => <option key={c.slug}>{c.name}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Slug (web address)"><input value={f.slug} onChange={(e) => set("slug", e.target.value)} className={inputCls} /></Field>
            <Field label="Tagline (short one-liner)"><input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} placeholder="784-piece hybrid hypercar with scissor doors" className={inputCls} /></Field>
            <Field label="Description (what customers read)">
              <textarea value={f.description} onChange={(e) => set("description", e.target.value)} rows={4} placeholder="Tell the story — the detail, the features, why they'll love it on their shelf." className={`${inputCls} resize-none`} />
            </Field>
          </FormSection>

          <FormSection title="Pricing & stock">
            <div className="grid grid-cols-2 gap-3">
              <Field label="MRP ₹ (crossed out)"><input type="number" value={f.price || ""} onChange={(e) => set("price", Number(e.target.value))} placeholder="2999" className={inputCls} /></Field>
              <Field label={`Selling price ₹${discount > 0 ? ` · saves ${discount}%` : ""}`}><input type="number" value={f.salePrice ?? ""} onChange={(e) => set("salePrice", e.target.value ? Number(e.target.value) : null)} placeholder="Blank = no discount" className={inputCls} /></Field>
              <Field label="Stock quantity"><input type="number" value={f.stock || ""} onChange={(e) => set("stock", Number(e.target.value))} placeholder="50" className={inputCls} /></Field>
              <Field label="Number of pieces"><input type="number" value={f.pieces || ""} onChange={(e) => set("pieces", Number(e.target.value))} placeholder="784" className={inputCls} /></Field>
            </div>
          </FormSection>

          <FormSection title="Details customers care about">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Build time (hours)"><input type="number" value={f.buildHours || ""} onChange={(e) => set("buildHours", Number(e.target.value))} placeholder="6" className={inputCls} /></Field>
              <Field label="Difficulty">
                <select value={f.difficulty} onChange={(e) => set("difficulty", e.target.value)} className={inputCls}>
                  {["Beginner", "Intermediate", "Advanced", "Master"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </Field>
              <Field label="Recommended age"><input value={f.ageRange} onChange={(e) => set("ageRange", e.target.value)} placeholder="14+" className={inputCls} /></Field>
              <Field label="Scale"><input value={f.scale} onChange={(e) => set("scale", e.target.value)} placeholder="1:10" className={inputCls} /></Field>
            </div>
            <Field label="What's in the box (one item per line)">
              <textarea value={f.whatsIncluded.join("\n")} onChange={(e) => set("whatsIncluded", e.target.value.split("\n"))} rows={3} placeholder={"Numbered building manual\nDisplay plinth with plaque\nSpare bricks"} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Star rating (0–5)"><input type="number" step="0.1" min="0" max="5" value={f.rating || ""} onChange={(e) => set("rating", Number(e.target.value))} placeholder="4.9" className={inputCls} /></Field>
              <Field label="Review count"><input type="number" value={f.reviewCount || ""} onChange={(e) => set("reviewCount", Number(e.target.value))} placeholder="128" className={inputCls} /></Field>
            </div>
          </FormSection>

          <FormSection title="Images">
            <Field label="Main image URL *"><input value={f.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://…" className={inputCls} /></Field>
            {f.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={f.imageUrl} alt="" className="h-36 w-full rounded-xl border border-black/10 bg-white object-contain" />
            )}
            <Field label="More image URLs (one per line)">
              <textarea value={f.gallery.join("\n")} onChange={(e) => set("gallery", e.target.value.split("\n"))} rows={3} placeholder={"https://…/angle-2.jpg\nhttps://…/angle-3.jpg"} className={`${inputCls} resize-none`} />
            </Field>
          </FormSection>

          <FormSection title="Appearance & badges">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Body colour">
                <div className="flex items-center gap-2">
                  <input type="color" value={f.bodyColor} onChange={(e) => set("bodyColor", e.target.value)} className="h-10 w-12 shrink-0 rounded-lg border border-black/15 bg-ink-800" />
                  <input value={f.bodyColor} onChange={(e) => set("bodyColor", e.target.value)} className={inputCls} />
                </div>
              </Field>
              <Field label="Accent colour">
                <div className="flex items-center gap-2">
                  <input type="color" value={f.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-10 w-12 shrink-0 rounded-lg border border-black/15 bg-ink-800" />
                  <input value={f.accentColor} onChange={(e) => set("accentColor", e.target.value)} className={inputCls} />
                </div>
              </Field>
            </div>
            <div className="flex flex-wrap gap-4 pt-1">
              {(["bestSeller", "isNew", "limited"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!f[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-brand-red" />
                  {k === "isNew" ? "New" : k === "bestSeller" ? "Best seller" : "Limited"}
                </label>
              ))}
            </div>
          </FormSection>
        </div>

        <div className="border-t border-black/10 px-6 py-4">
          <button onClick={() => onSave(f)} disabled={!f.name || !f.slug || !f.price} className="w-full rounded-full bg-brand-red text-white py-3 text-sm font-semibold disabled:opacity-50">
            Save product
          </button>
        </div>
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">{title}</p>
      {children}
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
