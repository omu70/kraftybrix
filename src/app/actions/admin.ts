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
