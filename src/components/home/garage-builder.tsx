"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { products } from "@/lib/products";
import type { Category } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";

const moods: { key: string; label: string; categories: Category[]; tint: string }[] = [
  { key: "hyper", label: "Hypercar", categories: ["Hypercars"], tint: "#0066FF" },
  { key: "super", label: "Supercar", categories: ["Supercars"], tint: "#FF2D20" },
  { key: "racing", label: "Racing", categories: ["Racing Cars"], tint: "#ff5e3a" },
  { key: "smoke", label: "Smoking Cars", categories: ["Smoking Cars"], tint: "#7a2fd6" },
  { key: "suv", label: "SUV & Trucks", categories: ["SUVs & Trucks"], tint: "#1f6f3f" },
  { key: "landmark", label: "Landmarks", categories: ["Landmarks"], tint: "#C9A24B" },
];

export function GarageBuilder() {
  const [active, setActive] = useState(moods[0]);
  const recs = products
    .filter((p) => active.categories.includes(p.category))
    .slice(0, 3);

  return (
    <section id="garage" className="relative border-y border-black/10 bg-ink-800/40 py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> Dream garage builder</p>
            <h2 className="h-display mt-3 text-4xl sm:text-5xl">What kind of driver are you?</h2>
            <p className="mt-4 text-black/60">Pick a vibe. We'll curate the perfect starter shelf.</p>
          </div>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {moods.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m)}
              className="relative rounded-full border px-6 py-3 text-sm font-semibold transition"
              style={{
                borderColor: active.key === m.key ? m.tint : "rgba(255,255,255,0.15)",
                color: active.key === m.key ? "#fff" : "rgba(255,255,255,0.65)",
                background: active.key === m.key ? `${m.tint}22` : "transparent",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {recs.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 text-center">
          <Link href="/collection" className="text-sm font-semibold text-brand-red hover:underline">
            Build the full garage →
          </Link>
        </div>
      </div>
    </section>
  );
}
