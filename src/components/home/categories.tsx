"use client";

import Link from "next/link";
import Image from "next/image";
import { categories, categoryCount, categoryImage } from "@/lib/products";

export function Categories() {
  return (
    <section id="categories" className="relative bg-ink-900 py-14 sm:py-20">
      <div className="container-wide">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-red">Shop by category</p>
            <h2 className="mt-2 font-archivo text-3xl font-extrabold tracking-tight text-cream sm:text-4xl">Find your obsession</h2>
          </div>
          <Link href="/collection" className="hidden shrink-0 text-sm font-semibold text-brand-red hover:underline sm:block">
            View all →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((cat) => {
            const img = categoryImage(cat.name);
            return (
              <Link
                key={cat.slug}
                href={`/collection?category=${encodeURIComponent(cat.name)}`}
                className="group overflow-hidden rounded-2xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div
                  className="relative aspect-[5/4] overflow-hidden"
                  style={{ background: `radial-gradient(80% 80% at 50% 40%, #ffffff 0%, ${cat.from ?? "#f0f0f0"}1f 100%)` }}
                >
                  {img && (
                    <Image
                      src={img}
                      alt={cat.name}
                      fill
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 300px"
                      className="object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 px-4 py-3">
                  <span className="truncate font-semibold text-cream">{cat.name}</span>
                  <span className="shrink-0 text-xs text-black/45">{categoryCount(cat.name)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
