"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, Star, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { HERO_BANNER } from "@/lib/constants";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden bg-charcoal text-white">
      {/* Banner image if set, else a rich studio gradient */}
      {HERO_BANNER ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_BANNER} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 65% 55% at 30% 45%, rgba(245,166,35,0.18) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 bg-grid-faint [background-size:60px_60px] opacity-[0.3] [mask-image:radial-gradient(80%_70%_at_40%_40%,black,transparent)]" />
          <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-brand-orange/20 blur-[120px]" />
          <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-blue/15 blur-[120px]" />
        </>
      )}

      <div className="container-wide relative z-10 pb-16 pt-28">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/70 backdrop-blur"
          >
            <Sparkles size={14} className="text-brand-gold" />
            Collector-grade brick automotive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease }}
            className="h-display mt-5 text-5xl text-balance drop-shadow-sm sm:text-6xl lg:text-7xl"
          >
            Build The Garage{" "}
            <span className="bg-gradient-to-r from-white via-white to-brand-gold bg-clip-text text-transparent">
              You&apos;ve Always Dreamed Of
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-6 max-w-lg text-lg text-white/75"
          >
Build it. Display it. Own it.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Link href="/collection">
                <Button size="lg" className="group">
                  Shop Collection
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link href="/bundle"><Button size="lg" variant="secondary">3 cars for ₹1999</Button></Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70"
          >
            <span className="flex items-center gap-1.5">
              <Star size={15} className="fill-brand-gold text-brand-gold" />
              <span className="font-semibold text-white">4.9</span> · 3,000+ builders
            </span>
            <span className="h-4 w-px bg-white/20" />
            <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-brand-gold" /> 30-day returns</span>
            <span className="h-4 w-px bg-white/20" />
            <span className="flex items-center gap-1.5"><Truck size={15} className="text-brand-gold" /> Free shipping ₹999+</span>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/50"
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}
