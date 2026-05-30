import { PrismaClient } from "@prisma/client";
import { products, categories } from "../src/lib/products";

const prisma = new PrismaClient();

/** Seeds the real KraftyBrix catalogue (from src/lib/products.ts → KraftyBrix.xlsx). */
async function main() {
  // Categories
  const catBySlug = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, blurb: c.blurb },
      create: { name: c.name, slug: c.slug, blurb: c.blurb },
    });
    catBySlug.set(c.name, row.id);
  }

  // Products
  for (const p of products) {
    const categoryId = catBySlug.get(p.category);
    if (!categoryId) continue;
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        tagline: p.tagline,
        description: p.description,
        price: p.price,
        salePrice: p.salePrice ?? null,
        pieces: p.pieces,
        buildHours: Math.round(p.buildHours),
        difficulty: p.difficulty as any,
        ageRange: p.ageRange,
        scale: p.scale,
        bodyColor: p.bodyColor,
        accentColor: p.accentColor,
        stock: p.inStock ? 50 : 0,
        bestSeller: !!p.bestSeller,
        isNew: !!p.isNew,
        limited: !!p.limited,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: p.images.map((i) => i.url),
        categoryId,
      },
    });
  }

  // Welcome coupon
  await prisma.coupon.upsert({
    where: { code: "BRICK10" },
    update: {},
    create: { code: "BRICK10", type: "PERCENT", value: 10, minSpend: 0, active: true },
  });

  console.log(`✅ Seeded ${categories.length} categories and ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
