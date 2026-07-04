"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

const POPULAR = ["Lamborghini", "Ferrari", "Bugatti", "Hypercars", "Smoking", "Bundle"];

export function SearchView({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");

  // Keep the URL query in sync so results are shareable / bookmarkable.
  useEffect(() => {
    const t = setTimeout(() => {
      const term = q.trim();
      router.replace(term ? `/search?q=${encodeURIComponent(term)}` : "/search", { scroll: false });
    }, 250);
    return () => clearTimeout(t);
  }, [q, router]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products.filter((p) =>
      [p.name, p.brand, p.category, p.tagline].some((f) => f?.toLowerCase().includes(term))
    );
  }, [q]);

  const term = q.trim();

  return (
    <div className="container-wide pt-28 pb-24">
      <h1 className="h-display text-4xl sm:text-5xl">Search</h1>

      <div className="relative mt-6 max-w-2xl">
        <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search cars, brands, categories…"
          className="w-full rounded-2xl border border-black/15 bg-ink-800 py-4 pl-12 pr-12 text-base outline-none transition focus:border-brand-red"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-black/50 hover:bg-black/[0.05] hover:text-cream"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {!term ? (
        <div className="mt-8">
          <p className="text-sm font-medium uppercase tracking-wider text-black/45">Popular searches</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {POPULAR.map((p) => (
              <button
                key={p}
                onClick={() => setQ(p)}
                className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/70 transition hover:border-brand-red hover:text-brand-red"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="mt-16 grid place-items-center rounded-2xl border border-dashed border-black/15 py-20 text-center">
          <p className="text-black/60">No models match “{term}”.</p>
          <Link href="/collection" className="mt-4 text-sm font-semibold text-brand-red hover:underline">
            Browse the full collection →
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-black/50">{results.length} {results.length === 1 ? "result" : "results"} for “{term}”</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
