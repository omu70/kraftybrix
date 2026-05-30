"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";

// 3D loaded client-side only — keeps the hero copy in the initial HTML for LCP/SEO.
const CarScene = dynamic(
  () => import("@/components/three/car-scene").then((m) => m.CarScene),
  { ssr: false, loading: () => <SceneSkeleton /> }
);

function SceneSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-40 w-72 animate-pulse rounded-2xl bg-black/[0.02]" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Backdrop layers */}
      <div className="absolute inset-0 bg-radial-spot opacity-80" />
      <div className="absolute inset-0 bg-grid-faint [background-size:60px_60px] opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />

      {/* 3D canvas */}
      <div className="absolute inset-0 z-0">
        <CarScene />
      </div>

      {/* Copy */}
      <div className="container-wide relative z-10 pointer-events-none">
        <div className="max-w-2xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow pointer-events-auto"
          >
            <Sparkles size={14} className="text-brand-red" />
            Collector-grade brick automotive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="h-display mt-5 text-5xl text-balance sm:text-6xl lg:text-7xl"
          >
            Build The Garage{" "}
            <span className="text-gradient-red">You've Always Dreamed Of</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-6 max-w-lg text-lg text-black/65"
          >
            Premium brick-built automotive collectibles for enthusiasts who
            never stop dreaming. Engineered down to the last stud.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.28 }}
            className="pointer-events-auto mt-9 flex flex-wrap items-center gap-4"
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
              <Link href="/#garage">
                <Button size="lg" variant="secondary">
                  Explore Garage
                </Button>
              </Link>
            </Magnetic>
          </motion.div>

          {/* Trust signals — CRO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-black/55"
          >
            <span className="flex items-center gap-2">
              <span className="text-brand-red font-semibold">4.9★</span> 12,000+ reviews
            </span>
            <span className="h-4 w-px bg-black/15" />
            <span>Lifetime brick guarantee</span>
            <span className="h-4 w-px bg-black/15" />
            <span>Ships in 24h</span>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-black/40"
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}
