"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  // Mouse parallax / tilt on the product.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 16 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 16 });
  const glowX = useSpring(useTransform(mx, [-0.5, 0.5], [-24, 24]), { stiffness: 120, damping: 20 });
  const glowY = useSpring(useTransform(my, [-0.5, 0.5], [-24, 24]), { stiffness: 120, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() { mx.set(0); my.set(0); }

  const price = (HERO_PRODUCT.salePrice ?? HERO_PRODUCT.price).toLocaleString("en-IN");

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal pt-24 text-white"
    >
      {/* Warm studio backdrop */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 60% 52%, rgba(245,166,35,0.16) 0%, transparent 70%)" }} />
      <div className="absolute inset-0 bg-grid-faint [background-size:60px_60px] opacity-[0.3] [mask-image:radial-gradient(80%_70%_at_60%_40%,black,transparent)]" />
      <div className="absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-brand-orange/20 blur-[120px]" />
      <div className="absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-brand-blue/15 blur-[120px]" />

      <div className="container-wide relative z-10 grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_1fr]">
        {/* Copy */}
        <motion.div style={{ y: copyY }} className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-white/60"
          >
            <Sparkles size={14} className="text-brand-gold" />
            Collector-grade brick automotive
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="h-display mt-5 text-5xl text-balance sm:text-6xl lg:text-7xl"
          >
            Build The Garage{" "}
            <span className="bg-gradient-to-r from-white via-white to-brand-gold bg-clip-text text-transparent">
              You&apos;ve Always Dreamed Of
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.18 }}
            className="mt-6 max-w-lg text-lg text-white/65"
          >
            Premium brick-built supercars &amp; icons. Build it. Display it. Own it.
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
              <Link href="/#garage"><Button size="lg" variant="secondary">Explore Garage</Button></Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/55"
          >
            <span className="flex items-center gap-1.5">
              <Star size={15} className="fill-brand-gold text-brand-gold" />
              <span className="font-semibold text-white">4.9</span> · 3,000+ builders
            </span>
            <span className="h-4 w-px bg-white/15" />
            <span>Lifetime guarantee</span>
            <span className="h-4 w-px bg-white/15" />
            <span>Ships in 24h</span>
          </motion.div>
        </motion.div>

        {/* Visual — product on a premium spotlight disc with mouse tilt */}
        <motion.div
          style={{ y: imgY }}
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative mx-auto w-full max-w-[540px] [perspective:1100px]"
        >
          <motion.div style={{ rotateX: rotX, rotateY: rotY }} className="relative aspect-square w-full">
            {/* brand-colour glow that follows the cursor */}
            <motion.div
              style={{ x: glowX, y: glowY, background: `radial-gradient(closest-side, ${HERO_PRODUCT.bodyColor}55, transparent)` }}
              className="absolute inset-2 -z-10 rounded-full blur-3xl"
            />
            {/* light spotlight disc */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle at 50% 42%, #ffffff 0%, #eef1f6 58%, #dbe0e8 100%)",
                boxShadow: "0 50px 130px -40px rgba(0,0,0,0.7), inset 0 2px 24px rgba(255,255,255,0.55)",
              }}
            />
            <div className="absolute inset-0 rounded-full ring-1 ring-white/15" />
            {/* soft contact shadow under the car */}
            <div className="absolute bottom-[16%] left-1/2 h-5 w-3/5 -translate-x-1/2 rounded-[100%] bg-black/35 blur-xl" />

            {/* car */}
            <Link href={`/product/${HERO_PRODUCT.slug}`} className="group absolute inset-0 grid place-items-center">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-[88%]"
              >
                <Image
                  src={HERO_PRODUCT.images[0].url}
                  alt={HERO_PRODUCT.name}
                  width={760}
                  height={620}
                  priority
                  className="w-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.05]"
                />
              </motion.div>
            </Link>

            {/* floating spec chip */}
            <div className="absolute -bottom-3 left-0 glass-strong rounded-2xl px-4 py-3">
              <p className="text-xs text-black/50">Featured build</p>
              <p className="font-display font-bold leading-tight text-cream">{HERO_PRODUCT.name}</p>
              <p className="text-sm font-semibold text-brand-gold">₹{price}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/40"
      >
        <ChevronDown size={26} />
      </motion.div>
    </section>
  );
}
