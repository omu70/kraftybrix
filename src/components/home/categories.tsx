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
          <h2 className="h-display mt-3 text-4xl sm:text-5xl">Find your obsession</h2>
        </Reveal>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((cat, i) => {
            // make a couple of cards span larger for an editorial grid
            const big = i === 0 || i === 3;
            const img = categoryImage(cat.name);
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={big ? "row-span-2 lg:col-span-1" : ""}
              >
                <Link
                  href={`/collection?category=${encodeURIComponent(cat.name)}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-ink-800 transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-card"
                >
                  {/* bright studio lightbox panel — product floats on light */}
                  <div
                    className="relative min-h-[110px] flex-1 overflow-hidden"
                    style={{ background: `radial-gradient(80% 80% at 50% 40%, #ffffff 0%, ${cat.from}1a 100%)` }}
                  >
                    {img && (
                      <Image
                        src={img}
                        alt={cat.name}
                        fill
                        sizes="(max-width:1024px) 50vw, 340px"
                        className="mix-blend-multiply object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-2"
                      />
                    )}
                  </div>
                  {/* dark info bar */}
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-cream">{cat.name}</h3>
                      <ArrowUpRight className="text-brand-gold opacity-0 transition group-hover:opacity-100" size={18} />
                    </div>
                    <p className="mt-1 text-sm text-black/55">{cat.blurb}</p>
                    <span className="mt-1 inline-block text-xs font-medium text-black/40">
                      {categoryCount(cat.name)} model{categoryCount(cat.name) === 1 ? "" : "s"}
                    </span>
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
