import { products as staticProducts } from "@/lib/products";
import type { Product, Category, Difficulty } from "@/lib/types";

/**
 * Server-only catalogue source.
 *
 * When a database is connected AND has products, the storefront reads from it,
 * so anything added in the admin shows up for customers. Otherwise (or on any
 * error) it falls back to the built-in catalogue, so the site can never go blank.
 *
 * Import this ONLY from server components / server actions (it touches Prisma).
 */

type DbProduct = {
  id: string; slug: string; name: string; brand: string;
  tagline: string; description: string; price: number; salePrice: number | null;
  rating: number; reviewCount: number; pieces: number; buildHours: number;
  difficulty: string; ageRange: string; scale: string; stock: number;
  bestSeller: boolean; isNew: boolean; limited: boolean;
  bodyColor: string; accentColor: string; images: string[]; whatsIncluded: string[];
  category: { name: string } | null;
};

function mapRow(r: DbProduct): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: (r.category?.name ?? "Supercars") as Category,
    tagline: r.tagline,
    description: r.description,
    price: r.price,
    salePrice: r.salePrice,
    rating: r.rating,
    reviewCount: r.reviewCount,
    pieces: r.pieces,
    buildHours: r.buildHours,
    difficulty: (r.difficulty || "Intermediate") as Difficulty,
    ageRange: r.ageRange,
    scale: r.scale,
    inStock: r.stock > 0,
    bestSeller: r.bestSeller,
    isNew: r.isNew,
    limited: r.limited,
    bodyColor: r.bodyColor,
    accentColor: r.accentColor,
    images: (r.images.length ? r.images : [""]).map((url) => ({ url, alt: r.name })),
    whatsIncluded: r.whatsIncluded ?? [],
    specs: [
      { label: "Pieces", value: r.pieces.toLocaleString("en-IN") },
      { label: "Scale", value: r.scale },
      { label: "Difficulty", value: r.difficulty },
      { label: "Recommended age", value: r.ageRange },
    ],
  };
}

export async function getCatalogueProducts(): Promise<Product[]> {
  if (!process.env.DATABASE_URL) return staticProducts;
  try {
    const { prisma } = await import("@/lib/prisma");
    const rows = await prisma.product.findMany({
      include: { category: true },
      orderBy: [{ bestSeller: "desc" }, { createdAt: "desc" }],
    });
    if (!rows.length) return staticProducts;
    return rows.map((r) => mapRow(r as unknown as DbProduct));
  } catch (e) {
    console.error("[catalogue] DB read failed, using built-in catalogue:", e);
    return staticProducts;
  }
}

export async function findProductBySlug(slug: string): Promise<Product | null> {
  const all = await getCatalogueProducts();
  return all.find((p) => p.slug === slug) ?? null;
}
