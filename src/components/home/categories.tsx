"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, categoryCount, categoryImage } from "@/lib/products";
import { SectionIndex } from "@/components/ui/section-index";

export function Categories() {
  const [active, setActive] = useState<string | null>(null);
  const activeImg = active ? categoryImage(active) : null;

  return (
    <section id="categories" className="relative overflow-hidden bg-ink-900 py-16 sm:py-24">
      {/* hover image reveal (desktop only) */}
      <div className="pointer-events-none absolute right-[5%] top-1/2 z-0 hidden w-72 -translate-y-1/2 lg:block xl:w-80">
        <AnimatePresence mode="wait">
          {activeImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <motion.img
              key={activeImg}
              src={activeImg}
              alt=""
              initial={{ opacity: 0, y: 16, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full object-contain mix-blend-multiply"
            />
          )}
        </AnimatePresence>
      </div>

      <div className="container-wide relative z-10">
        <SectionIndex index="02" label="The lineup" title="Find your obsession" />

        <ul className="mt-12 border-t border-black/15">
          {categories.map((c, i) => (
            <li
              key={c.slug}
              onMouseEnter={() => setActive(c.name)}
              onMouseLeave={() => setActive(null)}
            >
              <Link
                href={`/collection?category=${encodeURIComponent(c.name)}`}
                className="group flex items-center gap-5 border-b border-black/15 py-5 transition-colors hover:bg-black/[0.02] sm:py-7"
              >
                <span className="w-6 shrink-0 font-display text-xs text-black/35">0{i + 1}</span>
                <span className="min-w-0 flex-1 truncate font-archivo text-3xl font-black uppercase tracking-tight transition-all duration-300 group-hover:translate-x-3 group-hover:text-brand-red sm:text-5xl lg:text-6xl">
                  {c.name}
                </span>
                <span className="shrink-0 font-display text-[11px] uppercase tracking-[0.2em] text-black/40">
                  {categoryCount(c.name)} models
                </span>
                <span className="shrink-0 text-black/30 transition group-hover:translate-x-1 group-hover:text-brand-red">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
