"use client";

import { useEffect, useState } from "react";
import { useRecentlyViewed } from "@/store/recently-viewed";
import { products } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

/** Shows the visitor's recently-viewed products (excluding the current one). */
export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const ids = useRecentlyViewed((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const items = ids
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p))
    .slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="pb-24">
      <h2 className="h-display text-3xl">Recently viewed</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
