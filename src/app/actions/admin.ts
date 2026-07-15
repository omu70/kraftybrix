"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { products as seedProducts } from "@/lib/products";
import { COUPONS } from "@/lib/constants";
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

/** Strip any connection string / password from an error before showing it. */
function safeErr(e: unknown): string {
  const m = e instanceof Error ? e.message : String(e);
  return m.replace(/postgres(ql)?:\/\/[^\s"']+/gi, "[hidden]").replace(/\s+/g, " ").trim().slice(0, 220);
}

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  brand: z.string().default("KraftyBrix"),
  category: z.string(),
  tagline: z.string().default(""),
  description: z.string().default(""),
  price: z.coerce.number().int().positive(),
  salePrice: z.coerce.number().int().positive().nullable().optional(),
  pieces: z.coerce.number().int().nonnegative(),
  buildHours: z.coerce.number().int().nonnegative().default(0),
  difficulty: z.string().default("Intermediate"),
  ageRange: z.string().default("14+"),
  scale: z.string().default("1:10"),
  stock: z.coerce.number().int().nonnegative(),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().int().nonnegative().default(0),
  imageUrl: z.string().url().or(z.literal("")),
  gallery: z.array(z.string()).default([]),
  whatsIncluded: z.array(z.string()).default([]),
  bodyColor: z.string().default("#FF2D20"),
  accentColor: z.string().default("#111111"),
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
    brand: p.brand,
    category: p.category,
    tagline: p.tagline,
    description: p.description,
    price: p.price,
    salePrice: p.salePrice ?? null,
    pieces: p.pieces,
    buildHours: p.buildHours,
    difficulty: p.difficulty,
    ageRange: p.ageRange,
    scale: p.scale,
    stock: p.inStock ? 25 : 0,
    rating: p.rating,
    reviewCount: p.reviewCount,
    imageUrl: p.images[0]?.url ?? "",
    gallery: p.images.slice(1).map((i) => i.url),
    whatsIncluded: p.whatsIncluded ?? [],
    bodyColor: p.bodyColor,
    accentColor: p.accentColor,
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
          brand: r.brand,
          category: r.category?.name ?? "",
          tagline: r.tagline,
          description: r.description,
          price: r.price,
          salePrice: r.salePrice,
          pieces: r.pieces,
          buildHours: r.buildHours,
          difficulty: r.difficulty,
          ageRange: r.ageRange,
          scale: r.scale,
          stock: r.stock,
          rating: r.rating,
          reviewCount: r.reviewCount,
          imageUrl: r.images[0] ?? "",
          gallery: r.images.slice(1),
          whatsIncluded: r.whatsIncluded ?? [],
          bodyColor: r.bodyColor,
          accentColor: r.accentColor,
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
  if (!parsed.success) return { ok: false as const, error: "Please check the fields — name, price, pieces and a valid image URL are required." };
  if (!dbEnabled()) {
    return { ok: true as const, mode: "demo" as const, message: "Saved on screen (connect the database to save permanently)." };
  }
  try {
    const db = await prisma();
    const d = parsed.data;
    const category = await db.category.upsert({
      where: { slug: d.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      update: {},
      create: { name: d.category, slug: d.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    });
    const images = [d.imageUrl, ...d.gallery].map((s) => s.trim()).filter(Boolean);
    const data = {
      name: d.name, slug: d.slug, brand: d.brand || "KraftyBrix",
      tagline: d.tagline, description: d.description,
      price: d.price, salePrice: d.salePrice ?? null,
      pieces: d.pieces, buildHours: d.buildHours, difficulty: d.difficulty as never,
      ageRange: d.ageRange, scale: d.scale, stock: d.stock,
      rating: d.rating, reviewCount: d.reviewCount,
      bodyColor: d.bodyColor, accentColor: d.accentColor,
      bestSeller: !!d.bestSeller, isNew: !!d.isNew, limited: !!d.limited,
      images, whatsIncluded: d.whatsIncluded.map((s) => s.trim()).filter(Boolean),
      categoryId: category.id,
    };
    if (d.id) await db.product.update({ where: { id: d.id }, data });
    else await db.product.create({ data });
    revalidatePath("/admin");
    revalidatePath("/collection");
    return { ok: true as const, mode: "db" as const, message: "Product saved." };
  } catch (e) {
    console.error("[admin] save failed:", e);
    return { ok: false as const, error: "Save failed — " + safeErr(e) };
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
          rating: p.rating, reviewCount: p.reviewCount, images: p.images.map((i) => i.url),
          whatsIncluded: p.whatsIncluded ?? [], categoryId,
        },
      });
    }
    revalidatePath("/admin");
    revalidatePath("/collection");
    return { ok: true as const, count: products.length };
  } catch (e) {
    console.error("[admin] seed failed:", e);
    return { ok: false as const, error: "Load failed — " + safeErr(e) };
  }
}

/* ─────────────────────────  Inventory  ───────────────────────── */

export async function updateStock(id: string, stock: number) {
  if (!dbEnabled()) return { ok: true as const, mode: "demo" as const };
  try {
    const db = await prisma();
    await db.product.update({ where: { id }, data: { stock: Math.max(0, Math.round(stock)) } });
    revalidatePath("/admin");
    revalidatePath("/collection");
    return { ok: true as const, mode: "db" as const };
  } catch (e) {
    return { ok: false as const, error: "Stock update failed — " + safeErr(e) };
  }
}

/* ─────────────────────────  Coupons  ───────────────────────── */

export type AdminCoupon = {
  id?: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  minSpend: number;
  active: boolean;
};

const couponSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2).transform((s) => s.toUpperCase().replace(/\s+/g, "")),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.coerce.number().positive(),
  minSpend: z.coerce.number().nonnegative().default(0),
  active: z.boolean().default(true),
});

export async function listCoupons(): Promise<{ mode: "db" | "demo"; rows: AdminCoupon[] }> {
  if (dbEnabled()) {
    try {
      const db = await prisma();
      const rows = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
      return {
        mode: "db",
        rows: rows.map((c) => ({ id: c.id, code: c.code, type: c.type as "PERCENT" | "FIXED", value: c.value, minSpend: c.minSpend, active: c.active })),
      };
    } catch (e) {
      console.error("[admin] coupons read failed:", e);
    }
  }
  return {
    mode: "demo",
    rows: Object.entries(COUPONS).map(([code, c]) => ({ code, type: c.type, value: c.value, minSpend: 0, active: true })),
  };
}

export async function saveCoupon(input: AdminCoupon) {
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: "Enter a code, type and value." };
  if (!dbEnabled()) return { ok: true as const, mode: "demo" as const, message: "Connect the database to save coupons." };
  try {
    const db = await prisma();
    const d = parsed.data;
    await db.coupon.upsert({
      where: { code: d.code },
      update: { type: d.type as never, value: d.value, minSpend: d.minSpend, active: d.active },
      create: { code: d.code, type: d.type as never, value: d.value, minSpend: d.minSpend, active: d.active },
    });
    revalidatePath("/admin");
    return { ok: true as const, mode: "db" as const, message: "Coupon saved." };
  } catch (e) {
    return { ok: false as const, error: "Save failed — " + safeErr(e) };
  }
}

export async function deleteCoupon(code: string) {
  if (!dbEnabled()) return { ok: true as const };
  try {
    const db = await prisma();
    await db.coupon.deleteMany({ where: { code: code.toUpperCase() } });
    revalidatePath("/admin");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: safeErr(e) };
  }
}

/* ─────────────────────────  Subscribers (manage)  ───────────────────────── */

export async function addSubscriber(email: string, name?: string) {
  if (!z.string().email().safeParse(email).success) return { ok: false as const, error: "Enter a valid email." };
  if (!dbEnabled()) return { ok: true as const, mode: "demo" as const };
  try {
    const db = await prisma();
    await db.subscriber.upsert({ where: { email: email.toLowerCase() }, update: { name: name || undefined }, create: { email: email.toLowerCase(), name: name || undefined } });
    revalidatePath("/admin");
    return { ok: true as const, mode: "db" as const };
  } catch (e) {
    return { ok: false as const, error: safeErr(e) };
  }
}

export async function deleteSubscriber(email: string) {
  if (!dbEnabled()) return { ok: true as const };
  try {
    const db = await prisma();
    await db.subscriber.deleteMany({ where: { email } });
    revalidatePath("/admin");
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: safeErr(e) };
  }
}

/** One-click database diagnostic. Reports the exact reason in plain English. */
export async function testDatabase(): Promise<{ ok: boolean; message: string }> {
  if (!dbEnabled()) return { ok: false, message: "No DATABASE_URL is set in Vercel yet. Add it, then Redeploy." };
  try {
    const db = await prisma();
    const count = await db.product.count();
    return { ok: true, message: `Connected. ${count} product${count === 1 ? "" : "s"} in your database.` };
  } catch (e) {
    const raw = safeErr(e);
    let hint = `Error: ${raw}`;
    if (/does not exist|relation|P2021|no such table/i.test(raw))
      hint = "Your tables aren't created yet. In Vercel, hit Redeploy (the build creates them). If it still fails, your DATABASE_URL is the ‘pooled’ string — switch to the direct one (host without ‘-pooler’).";
    else if (/auth|password|P1000|not valid|credentials/i.test(raw))
      hint = "Wrong database password. Copy a fresh connection string from Neon and update DATABASE_URL in Vercel, then Redeploy.";
    else if (/reach|P1001|timed out|ENOTFOUND|connect/i.test(raw))
      hint = "Can’t reach the database. Check the DATABASE_URL host and that your Neon project isn’t paused.";
    else if (/channel_binding/i.test(raw))
      hint = "Remove ‘&channel_binding=require’ from your DATABASE_URL in Vercel, then Redeploy.";
    return { ok: false, message: hint };
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
