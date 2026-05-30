"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { categories, categoryCount } from "@/lib/products";
import { Reveal } from "@/components/ui/reveal";
import { BrickCarArt } from "@/components/brand/brick-car-art";

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
                  className="group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-black/10 p-6"
                  style={{ background: `linear-gradient(150deg, ${cat.from}22, #ffffff 72%)` }}
                >
                  {/* animated glow */}
                  <div
                    className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl transition-all duration-500 group-hover:opacity-60 group-hover:scale-125"
                    style={{ background: cat.from }}
                  />
                  {/* brick-car illustration that zooms on hover */}
                  <BrickCarArt
                    color={cat.from}
                    shadow={false}
                    className="absolute left-1/2 top-[44%] w-[70%] -translate-x-1/2 -translate-y-1/2 opacity-90 drop-shadow-xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-bold">{cat.name}</h3>
                      <ArrowUpRight className="opacity-0 transition group-hover:opacity-100" size={20} />
                    </div>
                    <p className="mt-1 text-sm text-black/55">{cat.blurb}</p>
                    <span className="mt-2 inline-block text-xs font-medium text-black/40">
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
