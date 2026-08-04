import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Blocks, Clock, Trophy, Baby, Sparkles, ShieldCheck, Gem, type LucideIcon } from "lucide-react";
import { getCatalogueProducts, findProductBySlug } from "@/lib/catalogue";
import { ProductMedia } from "@/components/product/product-media";
import { BuyBox } from "@/components/product/buy-box";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductCard } from "@/components/product/product-card";
import { Counter } from "@/components/ui/counter";
import { TrackRecentlyViewed } from "@/components/product/track-recently-viewed";
import { RecentlyViewed } from "@/components/product/recently-viewed";

// Reflect the live catalogue so admin-added products get their own pages.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) return {};
  const price = product.salePrice ?? product.price;
  return {
    title: product.pieces > 1
      ? `${product.name} — ${product.pieces.toLocaleString("en-IN")} Piece Brick Model`
      : `${product.name} — Ready-Built Die-Cast Model`,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: product.images.map((i) => ({ url: i.url, alt: i.alt })),
    },
    other: { "product:price:amount": String(price), "product:price:currency": "INR" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await findProductBySlug(slug);
  if (!product) notFound();

  const all = await getCatalogueProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  const fallback = all.filter((p) => p.id !== product.id).slice(0, 3);
  const recommendations = related.length ? related : fallback;

  // Ready-built (metal, pre-assembled) cars have no piece count / build time.
  // pieces <= 1 covers legacy DB rows saved with a "1 piece" placeholder.
  const readyBuilt = product.pieces <= 1;

  const stats: {
    icon: LucideIcon;
    value: number;
    label: string;
    suffix?: string;
    text?: string;
  }[] = readyBuilt
    ? [
        { icon: Sparkles, value: 0, label: "Assembly", text: "None" },
        { icon: ShieldCheck, value: 0, label: "Condition", text: "Pre-built" },
        { icon: Gem, value: 0, label: "Material", text: "Die-cast metal" },
        { icon: Baby, value: 0, label: "Recommended age", text: product.ageRange },
      ]
    : [
        { icon: Blocks, value: product.pieces, label: "Pieces", suffix: "" },
        { icon: Clock, value: product.buildHours, label: "Hours build time", suffix: "h" },
        { icon: Trophy, value: 0, label: "Difficulty", text: product.difficulty },
        { icon: Baby, value: 0, label: "Recommended age", text: product.ageRange },
      ];

  const price = product.salePrice ?? product.price;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    brand: { "@type": "Brand", name: "KraftyBrix" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="pt-28 pb-20 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackRecentlyViewed id={product.id} />

      <div className="container-wide">
        {/* breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-black/45">
          <Link href="/" className="hover:text-cream">Home</Link> /
          <Link
            href={`/collection?category=${encodeURIComponent(product.category)}`}
            className="hover:text-cream"
          >
            {product.category}
          </Link> /
          <span className="text-black/70">{product.name}</span>
        </nav>

        {/* build-type banner — distinguishes ready-built from kits */}
        <div
          className={`mb-6 flex items-center gap-3 rounded-2xl border p-4 ${
            readyBuilt ? "border-brand-gold/30 bg-brand-gold/[0.07]" : "border-brand-red/25 bg-brand-red/[0.05]"
          }`}
        >
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white ${readyBuilt ? "bg-brand-gold" : "bg-brand-red"}`}>
            {readyBuilt ? <Sparkles size={18} /> : <Blocks size={18} />}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-cream">{readyBuilt ? "Ready-built · arrives fully assembled" : `Build kit · ${product.pieces.toLocaleString()} pieces to assemble`}</p>
            <p className="text-xs text-black/55">
              {readyBuilt
                ? "Die-cast metal display model — no building required, straight onto your shelf."
                : "Snap-together ABS bricks with an illustrated step-by-step manual."}
            </p>
          </div>
          <Link href={readyBuilt ? "/bundle-ready" : "/bundle"} className={`ml-auto hidden shrink-0 text-sm font-semibold sm:block ${readyBuilt ? "text-brand-gold" : "text-brand-red"}`}>
            {readyBuilt ? "4 for ₹1999 →" : "3 for ₹2199 →"}
          </Link>
        </div>

        {/* hero: viewer + buy box */}
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ProductMedia images={product.images} bodyColor={product.bodyColor} accentColor={product.accentColor} />
          </div>
          <BuyBox product={product} />
        </div>

        {/* build stats */}
        <div className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-black/10 bg-ink-800 p-6 text-center">
              <s.icon className="mx-auto text-brand-red" size={26} />
              <div className="mt-3 font-display text-3xl font-bold">
                {s.text ? s.text : <Counter to={s.value} suffix={s.suffix} />}
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-black/45">{s.label}</p>
            </div>
          ))}
        </div>

        <ProductTabs product={product} />

        {/* related */}
        <section className="mt-24 pb-16">
          <h2 className="h-display text-3xl">You might also like</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}
