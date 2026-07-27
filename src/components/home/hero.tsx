"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, BadgeIndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_BANNER } from "@/lib/constants";

// 3D scene is client-only and loads after paint, so it never blocks the hero.
const HeroScene = dynamic(() => import("@/components/home/hero-scene"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0d0b09] pt-24 text-white">
      {/* lit fallback — a dramatic glow so the scene reads premium even before/without WebGL */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 68% 40%, rgba(245,166,35,0.18), transparent 70%), radial-gradient(50% 50% at 20% 80%, rgba(255,45,32,0.16), transparent 70%)" }} />

      {/* 3D layer */}
      {!HERO_BANNER && (
        <div className="absolute inset-0">
          <HeroScene />
        </div>
      )}
      {HERO_BANNER && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_BANNER} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </>
      )}

      {/* legibility gradients */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0b09] via-transparent to-[#0d0b09]/30" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0b09] to-transparent" />

      <div className="container-wide relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-white/70 backdrop-blur"
        >
          <Star size={13} className="text-brand-gold" /> Collector-grade brick automotive
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }}
          className="mt-5 font-archivo text-5xl font-black uppercase leading-[0.88] tracking-tight drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)] sm:text-7xl lg:text-[7rem]"
        >
          Build the<br /><span className="text-brand-red">icons</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-5 max-w-md text-lg text-white/75"
        >
          Premium brick-built supercars. Snap it together, display it forever — from ₹499.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.8 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link href="/collection">
            <Button size="lg" className="group">Shop the collection <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></Button>
          </Link>
          <Link href="/bundle"><Button size="lg" variant="secondary">3 cars for ₹1999</Button></Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }}
          className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-white/65"
        >
          <span className="flex items-center gap-1.5"><Star size={15} className="fill-brand-gold text-brand-gold" /> 4.9 · 3,000+ builders</span>
          <span className="flex items-center gap-1.5"><Truck size={15} className="text-brand-gold" /> Free shipping ₹999+</span>
          <span className="flex items-center gap-1.5"><BadgeIndianRupee size={15} className="text-brand-gold" /> Partial COD ₹99</span>
        </motion.div>
      </div>
    </section>
  );
}
