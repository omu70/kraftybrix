import { Suspense } from "react";
import type { Metadata } from "next";
import { CollectionView } from "@/components/collection/collection-view";
import { getCatalogueProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Collection — All Brick-Built Models",
  description:
    "Browse the full KraftyBrix collection of collector-grade brick-built supercars, hypercars, JDM legends and more. Advanced filtering by category, price and difficulty.",
};

// Always reflect the current catalogue (products added in the admin appear here).
export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const products = await getCatalogueProducts();
  return (
    <Suspense fallback={<div className="container-wide pt-40 text-black/50">Loading collection…</div>}>
      <CollectionView products={products} />
    </Suspense>
  );
}
