"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { products, categories } from "@/lib/products";
import type { Difficulty } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";

const sorts = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "best", label: "Best Selling" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
] as const;

const difficulties: Difficulty[] = ["Beginner", "Intermediate", "Advanced", "Master"];
const PRICE_STEPS = [0, 5000, 10000, 15000, 20000];

export function CollectionView() {
  const params = useSearchParams();
  const initialCat = params.get("category");

  const [cats, setCats] = useState<string[]>(initialCat ? [initialCat] : []);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [diffs, setDiffs] = useState<Difficulty[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState<(typeof sorts)[number]["key"]>("featured");
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggle = <T,>(list: T[], v: T, set: (l: T[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const filtered = useMemo(() => {
    let r = products.filter((p) => {
      if (cats.length && !cats.includes(p.category)) return false;
      if ((p.salePrice ?? p.price) > maxPrice) return false;
      if (diffs.length && !diffs.includes(p.difficulty)) return false;
      if (inStockOnly && !p.inStock) return false;
      if (p.rating < minRating) return false;
      return true;
    });
    switch (sort) {
      case "newest": r = [...r].sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      case "best": r = [...r].sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "price-asc": r = [...r].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price)); break;
      case "price-desc": r = [...r].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price)); break;
      default: r = [...r].sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller));
    }
    return r;
  }, [cats, maxPrice, diffs, inStockOnly, minRating, sort]);

  const clearAll = () => {
    setCats([]); setMaxPrice(20000); setDiffs([]); setInStockOnly(false); setMinRating(0);
  };

  const Filters = (
    <div className="space-y-8">
      <FilterGroup title="Category">
        {categories.map((c) => (
          <CheckRow key={c.slug} checked={cats.includes(c.name)} onChange={() => toggle(cats, c.name, setCats)} label={c.name} />
        ))}
      </FilterGroup>

      <FilterGroup title={`Max price: ₹${maxPrice.toLocaleString("en-IN")}`}>
        <input
          type="range" min={5000} max={20000} step={1000} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-red"
        />
        <div className="flex justify-between text-xs text-black/40">
          {PRICE_STEPS.map((s) => <span key={s}>₹{s / 1000}k</span>)}
        </div>
      </FilterGroup>

      <FilterGroup title="Difficulty">
        {difficulties.map((d) => (
          <CheckRow key={d} checked={diffs.includes(d)} onChange={() => toggle(diffs, d, setDiffs)} label={d} />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating">
        {[4.5, 4.7, 4.9].map((r) => (
          <CheckRow key={r} checked={minRating === r} onChange={() => setMinRating(minRating === r ? 0 : r)} label={`${r}★ & up`} />
        ))}
      </FilterGroup>

      <FilterGroup title="Availability">
        <CheckRow checked={inStockOnly} onChange={() => setInStockOnly((v) => !v)} label="In stock only" />
      </FilterGroup>

      <button onClick={clearAll} className="text-sm text-brand-red hover:underline">Clear all filters</button>
    </div>
  );

  return (
    <div className="container-wide pt-28">
      <header className="border-b border-black/10 pb-8">
        <p className="eyebrow"><span className="h-px w-8 bg-brand-red" /> The collection</p>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl">Every dream, in brick</h1>
        <p className="mt-3 text-black/55">{filtered.length} models</p>
      </header>

      <div className="flex items-center justify-between gap-4 py-5">
        <button onClick={() => setMobileFilters(true)} className="flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-sm lg:hidden">
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-black/45">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-black/15 bg-ink-800 px-3 py-2 outline-none"
          >
            {sorts.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-8 pb-24 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{Filters}</div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-2xl border border-black/10 py-24 text-center text-black/50">
              No models match your filters.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileFilters(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-ink-800 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Filters</h3>
              <button onClick={() => setMobileFilters(false)}><X /></button>
            </div>
            {Filters}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button onClick={onChange} className="flex w-full items-center gap-2.5 text-sm text-black/70 hover:text-cream">
      <span className={cn("grid h-4 w-4 place-items-center rounded border", checked ? "border-brand-red bg-brand-red" : "border-black/25")}>
        {checked && <span className="h-1.5 w-1.5 rounded-sm bg-white" />}
      </span>
      {label}
    </button>
  );
}
