import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/search/search-view";
import { getCatalogueProducts } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the KraftyBrix collection of brick-built supercars, hypercars, JDM legends and more.",
};

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const products = await getCatalogueProducts();
  return (
    <Suspense fallback={<div className="container-wide pt-40 text-black/50">Loading search…</div>}>
      <SearchView products={products} />
    </Suspense>
  );
}
