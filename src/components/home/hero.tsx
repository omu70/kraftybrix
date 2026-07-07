"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { products } from "@/lib/products";
import { HERO_BANNER } from "@/lib/constants";

const CAR =
  products.find((p) => p.slug.includes("sian")) ??
  products.find((p) => p.category === "Hypercars") ??
  products[0];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const sale = (CAR.salePrice ?? CAR.price).toLocaleString("en-IN");
  const mrp = CAR.price.toLocaleString("en-IN");

  return (
    <section className="relative overflow-hidden bg-ink-900 pt-24 text-cream">
      {HERO_BANNER && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_BANNER} alt="" className="absolute inset-0 h-full w-full object-cover opacity-100" />
          <div className="absolute inset-0 bg-ink-900/70" />
        </>
      )}

      {/* running header */}
      <div className="container-wide relative z-10 flex items-center gap-4 py-4 font-display text-[11px] uppercase tracking-[0.28em] text-black/45">
        <span className="text-charcoal">KraftyBrix</span>
        <span className="h-px flex-1 bg-black/15" />
        <span>Issue 01 — Collector-grade brick automotive</span>
      </div>

      <div className="container-wide relative z-10 grid items-center gap-4 pb-10 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-[1.05fr_0.95fr]">
        {/* headline */}
        <div className="relative z-10 pt-8 lg:pt-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="font-archivo font-black uppercase leading-[0.82] tracking-[-0.03em] text-[22vw] sm:text-[15vw] lg:text-[10.5rem]"
          >
            Build<br />the<br /><span className="text-brand-red">icons</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-7 font-display text-xs uppercase tracking-[0.2em] text-black/45"
          >
            Featured — {CAR.name} · {CAR.pieces.toLocaleString("en-IN")} pcs · {CAR.scale}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3"
          >
            <Link href="/collection" className="group inline-flex items-center gap-2 border-b-[3px] border-charcoal pb-1 font-archivo text-base font-extrabold uppercase tracking-wide text-charcoal">
              Shop the collection
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <span className="font-archivo text-base font-extrabold text-charcoal">
              ₹{sale} <s className="ml-1 font-semibold text-black/35">₹{mrp}</s>
            </span>
          </motion.div>
        </div>

        {/* car — bleeds off the right margin */}
        <motion.div
          initial={{ opacity: 0, scale: 1.06, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.1, ease }}
          className="relative"
        >
          <Image
            src={CAR.images[0].url}
            alt={CAR.name}
            width={1100}
            height={760}
            priority
            className="w-[122%] max-w-none -translate-x-[8%] object-contain mix-blend-multiply lg:w-[138%]"
          />
        </motion.div>
      </div>

      {/* trust rule */}
      <div className="container-wide relative z-10 flex flex-wrap gap-x-9 gap-y-3 border-t border-black/10 py-6 font-display text-sm text-black/60">
        <span className="flex items-center gap-1.5"><span className="text-brand-gold">★</span> 4.9 · 3,000+ builders</span>
        <span className="hidden h-4 w-px bg-black/15 sm:block" />
        <span>Free shipping over ₹999</span>
        <span className="hidden h-4 w-px bg-black/15 sm:block" />
        <span>Partial COD — ₹99 now</span>
        <span className="hidden h-4 w-px bg-black/15 sm:block" />
        <span>30-day returns</span>
      </div>
    </section>
  );
}
