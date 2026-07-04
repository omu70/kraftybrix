"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { products as seedProducts } from "@/lib/products";
import type { Product } from "@/lib/types";

/**
 * Admin product management.
 *
 * Works in two modes:
 *  • DATABASE_URL set  → reads/writes the real Postgres DB via Prisma (go-live).
 *  • no DATABASE_URL   → falls back to the in-memory seed catalogue (demo).
 *
 * The UI is identical in both modes, so the moment you connect a database
 * (Neon free tier) and run `npm run db:push && npm run db:seed`, the admin
 * becomes fully persistent with zero code changes.
 */

const dbEnabled = () => !!process.env.DATABASE_URL;

async function prisma() {
  const { prisma } = await import("@/lib/prisma");
  return prisma;
}

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string(),
  price: z.coerce.number().int().positive(),
  salePrice: z.coerce.number().int().positive().nullable().optional(),
  pieces: z.coerce.number().int().nonnegative(),
  stock: z.coerce.number().int().nonnegative(),
  imageUrl: z.string().url().or(z.literal("")),
  bodyColor: z.string(),
  bestSeller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  limited: z.boolean().optional(),
});

export type AdminProduct = z.infer<typeof productSchema>;

/** Map a domain Product to the admin row shape. */
function toAdminRow(p: Product): AdminProduct {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    salePrice: p.salePrice ?? null,
    pieces: p.pieces,
    stock: p.inStock ? 25 : 0,
    imageUrl: p.images[0]?.url ?? "",
    bodyColor: p.bodyColor,
    bestSeller: p.bestSeller,
    isNew: p.isNew,
    limited: p.limited,
  };
}

export async function listAdminProducts(): Promise<{ mode: "db" | "demo"; rows: AdminProduct[] }> {
  if (dbEnabled()) {
    try {
      const db = await prisma();
      const rows = await db.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      });
      return {
        mode: "db",
        rows: rows.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          category: r.category?.name ?? "",
          price: r.price,
          salePrice: r.salePrice,
          pieces: r.pieces,
          stock: r.stock,
          imageUrl: r.images[0] ?? "",
          bodyColor: r.bodyColor,
          bestSeller: r.bestSeller,
          isNew: r.isNew,
          limited: r.limited,
        })),
      };
    } catch (e) {
      console.error("[admin] DB read failed, using seed:", e);
    }
  }
  return { mode: "demo", rows: seedProducts.map(toAdminRow) };
}

export async function saveAdminProduct(input: AdminProduct) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Please check the fields." };
  if (!dbEnabled()) {
    return { ok: true as const, mode: "demo" as const, message: "Saved locally (connect a database to persist)." };
  }
  try {
    const db = await prisma();
    const d = parsed.data;
    const category = await db.category.upsert({
      where: { slug: d.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {},
      create: { name: d.category, slug: d.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    });
    const data = {
      name: d.name, slug: d.slug, price: d.price, salePrice: d.salePrice ?? null,
      pieces: d.pieces, stock: d.stock, bodyColor: d.bodyColor,
      bestSeller: !!d.bestSeller, isNew: !!d.isNew, limited: !!d.limited,
      images: d.imageUrl ? [d.imageUrl] : [], categoryId: category.id,
      brand: "KraftyBrix", tagline: "", description: "",
    };
    if (d.id) await db.product.update({ where: { id: d.id }, data });
    else await db.product.create({ data });
    revalidatePath("/admin");
    revalidatePath("/collection");
    return { ok: true as const, mode: "db" as const, message: "Product saved." };
  } catch (e) {
    console.error("[admin] save failed:", e);
    return { ok: false as const, error: "Could not save. Check DB connection." };
  }
}

/** One-click: load the 30 real KraftyBrix products into the database. */
export async function seedCatalogue() {
  if (!dbEnabled()) return { ok: false as const, error: "Connect a database first (add DATABASE_URL)." };
  try {
    const db = await prisma();
    const { products, categories } = await import("@/lib/products");
    const catId = new Map<string, string>();
    for (const c of categories) {
      const row = await db.category.upsert({
        where: { slug: c.slug },
        update: { name: c.name, blurb: c.blurb },
        create: { name: c.name, slug: c.slug, blurb: c.blurb },
      });
      catId.set(c.name, row.id);
    }
    for (const p of products) {
      const categoryId = catId.get(p.category);
      if (!categoryId) continue;
      await db.product.upsert({
        where: { slug: p.slug },
        update: {},
        create: {
          slug: p.slug, name: p.name, brand: p.brand, tagline: p.tagline,
          description: p.description, price: p.price, salePrice: p.salePrice ?? null,
          pieces: p.pieces, buildHours: Math.round(p.buildHours), difficulty: p.difficulty as never,
          ageRange: p.ageRange, scale: p.scale, bodyColor: p.bodyColor, accentColor: p.accentColor,
          stock: p.inStock ? 50 : 0, bestSeller: !!p.bestSeller, isNew: !!p.isNew, limited: !!p.limited,
          rating: p.rating, reviewCount: p.reviewCount, images: p.images.map((i) => i.url), categoryId,
        },
      });
    }
    revalidatePath("/admin");
    revalidatePath("/collection");
    return { ok: true as const, count: products.length };
  } catch (e) {
    console.error("[admin] seed failed:", e);
    return { ok: false as const, error: "Could not load products." };
  }
}

export async function deleteAdminProduct(id: string) {
  if (!dbEnabled()) return { ok: true as const, mode: "demo" as const };
  try {
    const db = await prisma();
    await db.product.delete({ where: { id } });
    revalidatePath("/admin");
    return { ok: true as const, mode: "db" as const };
  } catch (e) {
    console.error("[admin] delete failed:", e);
    return { ok: false as const, error: "Could not delete." };
  }
}

/* ─────────────────────────  Orders  ───────────────────────── */

export type OrderStatus =
  | "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  total: number;
  amountPaid: number;
  codBalance: number;
  paymentMethod: "ONLINE" | "PARTIAL_COD";
  paymentStatus: string;
  status: OrderStatus;
  createdAt: string;
  items: { name: string; quantity: number; price: number }[];
};

const demoOrders: AdminOrder[] = [
  { id: "d1", orderNumber: "KB7H2K9", customer: "Arjun Mehta", email: "arjun@example.com", phone: "98•••••210", total: 1699, amountPaid: 99, codBalance: 1600, paymentMethod: "PARTIAL_COD", paymentStatus: "PARTIAL", status: "CONFIRMED", createdAt: new Date(Date.now() - 36e5).toISOString(), items: [{ name: "Velocità GT", quantity: 1, price: 1699 }] },
  { id: "d2", orderNumber: "KB7H2K8", customer: "Priya Kapoor", email: "priya@example.com", phone: "99•••••118", total: 1999, amountPaid: 1999, codBalance: 0, paymentMethod: "ONLINE", paymentStatus: "PAID", status: "SHIPPED", createdAt: new Date(Date.now() - 9e6).toISOString(), items: [{ name: "3-for-₹1999 Bundle", quantity: 1, price: 1999 }] },
  { id: "d3", orderNumber: "KB7H2K7", customer: "Daniel Rao", email: "daniel@example.com", phone: "97•••••442", total: 699, amountPaid: 99, codBalance: 600, paymentMethod: "PARTIAL_COD", paymentStatus: "PARTIAL", status: "PROCESSING", createdAt: new Date(Date.now() - 18e6).toISOString(), items: [{ name: "Circuit Racer R1", quantity: 1, price: 699 }] },
  { id: "d4", orderNumber: "KB7H2K6", customer: "Sana Trivedi", email: "sana@example.com", phone: "96•••••773", total: 2899, amountPaid: 2899, codBalance: 0, paymentMethod: "ONLINE", paymentStatus: "PAID", status: "DELIVERED", createdAt: new Date(Date.now() - 26e6).toISOString(), items: [{ name: "Apex Hypercar", quantity: 1, price: 2899 }] },
];

export async function listAdminOrders(): Promise<{ mode: "db" | "demo"; rows: AdminOrder[] }> {
  if (dbEnabled()) {
    try {
      const db = await prisma();
      const rows = await db.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 200,
      });
      return {
        mode: "db",
        rows: rows.map((o) => {
          const addr = (o.shippingAddress ?? {}) as { fullName?: string; phone?: string };
          return {
            id: o.id,
            orderNumber: o.orderNumber,
            customer: addr.fullName ?? o.guestEmail ?? "Guest",
            email: o.guestEmail ?? "",
            phone: addr.phone ?? "",
            total: o.total,
            amountPaid: o.amountPaid,
            codBalance: o.codBalance,
            paymentMethod: o.paymentMethod as AdminOrder["paymentMethod"],
            paymentStatus: o.paymentStatus,
            status: o.status as OrderStatus,
            createdAt: o.createdAt.toISOString(),
            items: o.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
          };
        }),
      };
    } catch (e) {
      console.error("[admin] orders read failed:", e);
    }
  }
  return { mode: "demo", rows: demoOrders };
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  if (!dbEnabled()) return { ok: true as const, mode: "demo" as const };
  try {
    const db = await prisma();
    await db.order.update({ where: { id }, data: { status: status as never } });
    revalidatePath("/admin");
    return { ok: true as const, mode: "db" as const };
  } catch (e) {
    console.error("[admin] order status update failed:", e);
    return { ok: false as const, error: "Could not update order." };
  }
}

/* ─────────────────────────  Dashboard stats  ───────────────────────── */

export type AdminStats = {
  revenue: number;        // money actually collected online (amountPaid)
  grossValue: number;     // sum of order totals
  orders: number;
  aov: number;            // average order value
  pendingCod: number;     // cash still to collect on delivery
};

export async function adminStats(): Promise<{ mode: "db" | "demo"; stats: AdminStats }> {
  if (dbEnabled()) {
    try {
      const db = await prisma();
      const orders = await db.order.findMany({
        select: { total: true, amountPaid: true, codBalance: true, status: true },
      });
      const revenue = orders.reduce((s, o) => s + o.amountPaid, 0);
      const grossValue = orders.reduce((s, o) => s + o.total, 0);
      const count = orders.length;
      const aov = count ? Math.round(grossValue / count) : 0;
      const pendingCod = orders
        .filter((o) => o.status !== "DELIVERED" && o.status !== "CANCELLED" && o.status !== "RETURNED")
        .reduce((s, o) => s + o.codBalance, 0);
      return { mode: "db", stats: { revenue, grossValue, orders: count, aov, pendingCod } };
    } catch (e) {
      console.error("[admin] stats failed:", e);
    }
  }
  const grossValue = demoOrders.reduce((s, o) => s + o.total, 0);
  return {
    mode: "demo",
    stats: {
      revenue: demoOrders.reduce((s, o) => s + o.amountPaid, 0),
      grossValue,
      orders: demoOrders.length,
      aov: Math.round(grossValue / demoOrders.length),
      pendingCod: demoOrders.reduce((s, o) => s + o.codBalance, 0),
    },
  };
}

/* ─────────────────────────  Subscribers  ───────────────────────── */

export async function listSubscribers(): Promise<{ mode: "db" | "demo"; rows: { email: string; name: string | null; createdAt: string }[] }> {
  if (dbEnabled()) {
    try {
      const db = await prisma();
      const rows = await db.subscriber.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
      return { mode: "db", rows: rows.map((r) => ({ email: r.email, name: r.name, createdAt: r.createdAt.toISOString() })) };
    } catch (e) {
      console.error("[admin] subscribers read failed:", e);
    }
  }
  return {
    mode: "demo",
    rows: [
      { email: "arjun@example.com", name: "Arjun Mehta", createdAt: new Date(Date.now() - 8e7).toISOString() },
      { email: "priya@example.com", name: "Priya Kapoor", createdAt: new Date(Date.now() - 16e7).toISOString() },
      { email: "collector@example.com", name: "Rahul V.", createdAt: new Date(Date.now() - 24e7).toISOString() },
    ],
  };
}

/* ─────────────────────────  Config status  ───────────────────────── */

export async function getConfigStatus() {
  return {
    database: !!process.env.DATABASE_URL,
    razorpay: !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    email: !!process.env.RESEND_API_KEY,
    adminProtected: !!process.env.ADMIN_SESSION,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  };
}
