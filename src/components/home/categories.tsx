"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories, categoryCount, categoryImage } from "@/lib/products";
import { Reveal } from "@/components/ui/reveal";

export function Categories() {
  return (
    <section id="categories" className="relative py-24">
      <div className="container-wide">
        <Reveal>
          <p className="eyebrow"><span className="h-px w-8 bg-brand-red" /> Explore the lineup</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-display mt-3 text-4xl sm:text-5xl">Find your obsession</h2>
            <Link href="/collection" className="hidden text-sm font-semibold text-brand-red hover:underline sm:inline">
              View all models →
            </Link>
          </div>
        </Reveal>

        {/* quick-filter chips */}
        <Reveal>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/collection" className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/collection?category=${encodeURIComponent(c.name)}`}
                className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium text-black/70 transition hover:border-brand-gold hover:text-cream"
              >
                {c.name} <span className="text-black/35">· {categoryCount(c.name)}</span>
              </Link>
            ))}
          </div>
        </Reveal>

        {/* uniform category grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat, i) => {
            const img = categoryImage(cat.name);
            const count = categoryCount(cat.name);
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/collection?category=${encodeURIComponent(cat.name)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-card"
                >
                  <div
                    className="relative aspect-[5/4] overflow-hidden"
                    style={{ background: `radial-gradient(85% 85% at 50% 38%, #ffffff 0%, ${cat.from ?? "#f0f0f0"}22 100%)` }}
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={cat.name}
                        fill
                        sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 300px"
                        className="object-contain p-5 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-2"
                      />
                    )}
                    <span className="absolute left-3 top-3 rounded-full bg-black/[0.06] px-2 py-1 text-[11px] font-semibold text-black/60 backdrop-blur">
                      {count} model{count === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-2 p-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-base font-bold text-cream">{cat.name}</h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-black/50">{cat.blurb}</p>
                    </div>
                    <ArrowUpRight size={18} className="shrink-0 text-brand-gold transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
