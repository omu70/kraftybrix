"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-wide pt-28 pb-24">
      <header className="border-b border-black/10 pb-8">
        <p className="eyebrow"><span className="h-px w-8 bg-brand-red" /> Saved for later</p>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl">Your wishlist</h1>
        {mounted && items.length > 0 && (
          <p className="mt-3 text-black/55">{items.length} {items.length === 1 ? "model" : "models"} saved</p>
        )}
      </header>

      {!mounted ? (
        <div className="py-24 text-center text-black/40">Loading…</div>
      ) : items.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-black/15 py-24 text-center">
          <Heart size={40} className="text-black/25" />
          <p className="mt-4 text-black/60">You haven&apos;t saved any models yet.</p>
          <p className="mt-1 text-sm text-black/45">Tap the heart on any car to keep it here.</p>
          <Link href="/collection"><Button className="mt-6">Browse the collection</Button></Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
