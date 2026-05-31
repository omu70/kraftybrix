"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { products } from "@/lib/products";

const HERO_PRODUCT =
  products.find((p) => p.slug.includes("sian")) ??
  products.find((p) => p.category === "Hypercars") ??
  products[0];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Gentle parallax only — never gate visibility on scroll.
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-radial-spot opacity-90" />
      <div className="absolute inset-0 bg-grid-faint [background-size:60px_60px] opacity-[0.5] [mask-image:radial-gradient(80%_70%_at_60%_40%,black,transparent)]" />
      <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-brand-red/15 blur-[120px]" />
      <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-blue/15 blur-[120px]" />

      <div className="container-wide relative z-10 grid items-center gap-10 pb-16 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <motion.div style={{ y: copyY }} className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow"
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
            className="mt-6 max-w-lg text-lg text-black/60"
          >
            Premium brick-built supercars, hypercars and icons — engineered down
            to the last stud. Build it. Display it. Own the dream.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              <Link href="/#garage">
                <Button size="lg" variant="secondary">Explore Garage</Button>
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-black/55"
          >
            <span className="flex items-center gap-1.5">
              <Star size={15} className="fill-brand-red text-brand-red" />
              <span className="font-semibold text-zinc-900">4.9</span> · 3,000+ builders
            </span>
            <span className="h-4 w-px bg-black/15" />
            <span>Lifetime guarantee</span>
            <span className="h-4 w-px bg-black/15" />
            <span>Ships in 24h</span>
          </motion.div>
        </motion.div>

        {/* Visual — real product hero image */}
        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div
            className="absolute inset-0 -z-10 rounded-[40px] blur-2xl"
            style={{ background: `radial-gradient(60% 60% at 50% 45%, ${HERO_PRODUCT.bodyColor}55, transparent 70%)` }}
          />
          <Link href={`/product/${HERO_PRODUCT.slug}`} className="group block">
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={HERO_PRODUCT.images[0].url}
                alt={HERO_PRODUCT.name}
                width={760}
                height={620}
                priority
                className="mx-auto w-full max-w-xl object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </motion.div>
          </Link>
          {/* floating spec chip */}
          <div className="absolute bottom-2 left-2 glass rounded-2xl px-4 py-3 backdrop-blur-xl">
            <p className="text-xs text-black/50">Featured build</p>
            <p className="font-display font-bold leading-tight">{HERO_PRODUCT.name}</p>
            <p className="text-sm font-semibold text-brand-red">
              ₹{(HERO_PRODUCT.salePrice ?? HERO_PRODUCT.price).toLocaleString("en-IN")}
            </p>
          </div>
        </motion.div>
      </div>

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
