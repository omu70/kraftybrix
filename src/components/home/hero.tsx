"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Truck, BadgeIndianRupee, RotateCcw, Gift, Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/products";
import { HERO_BANNER } from "@/lib/constants";

const CAR =
  products.find((p) => p.slug.includes("sian")) ??
  products.find((p) => p.category === "Block Cars") ??
  products[0];

export function Hero() {
  const sale = CAR.salePrice ?? CAR.price;
  const off = CAR.salePrice ? Math.round((1 - CAR.salePrice / CAR.price) * 100) : 0;

  if (HERO_BANNER) {
    return (
      <section className="relative overflow-hidden bg-charcoal pt-24 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_BANNER} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
        <div className="container-wide relative z-10 flex min-h-[62vh] flex-col justify-center py-14">
          <h1 className="max-w-xl font-archivo text-4xl font-extrabold leading-tight sm:text-6xl">Build the supercars you love.</h1>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/collection"><Button size="lg">Shop the collection</Button></Link>
            <Link href="/bundle"><Button size="lg" variant="secondary">Bundle deals</Button></Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-ink-900 pt-24">
      <div className="container-wide grid items-center gap-8 py-8 lg:grid-cols-2 lg:py-12">
        {/* copy — visible by default; no opacity gating (never render blank) */}
        <div>
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.12em] text-black/45">
            <Star size={13} className="fill-brand-gold text-brand-gold" /> India&apos;s favourite brick-built cars
          </span>
          <h1 className="mt-5 font-archivo text-[2.4rem] font-extrabold leading-[1.02] tracking-tight text-cream sm:text-6xl lg:text-7xl">
            Build the supercars<br className="hidden sm:block" /> you love.
          </h1>
          <p className="mt-4 max-w-md text-base text-black/55 sm:text-lg">
            Collector-grade block &amp; die-cast cars — from ₹499.
          </p>

          {/* One primary CTA; bundles as quiet secondary chips */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/collection">
              <Button size="lg" className="group">Shop the collection <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></Button>
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link href="/bundle" className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black/70 transition hover:border-black/35 hover:text-cream">
              <Blocks size={15} /> Any 3 block cars · ₹2,199
            </Link>
            <Link href="/bundle-ready" className="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black/70 transition hover:border-black/35 hover:text-cream">
              <Gift size={15} /> Any 4 die-cast · ₹1,999
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/55">
            <span className="flex items-center gap-1.5"><Star size={15} className="fill-brand-gold text-brand-gold" /> 4.9 · 3,000+ builders</span>
            <span className="flex items-center gap-1.5"><Truck size={15} className="text-black/40" /> Free shipping ₹999+</span>
            <span className="flex items-center gap-1.5"><BadgeIndianRupee size={15} className="text-black/40" /> Partial COD ₹99</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={15} className="text-black/40" /> 7-day returns</span>
          </div>
        </div>

        {/* product */}
        <div className="relative max-lg:order-first">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-black/10 bg-white sm:max-w-md">
            {off > 0 && <span className="absolute left-4 top-4 z-10 rounded-full bg-brand-red px-3 py-1 text-sm font-bold text-white">-{off}%</span>}
            <Link href={`/product/${CAR.slug}`}>
              <Image src={CAR.images[0].url} alt={CAR.name} fill sizes="(max-width:1024px) 90vw, 460px" priority className="object-contain p-6 transition-transform duration-500 hover:scale-105" />
            </Link>
            <div className="absolute bottom-4 left-4 rounded-xl border border-black/10 bg-ink-900/95 px-4 py-2.5">
              <p className="text-xs text-black/50">{CAR.name}</p>
              <p className="font-display font-bold text-cream">
                ₹{sale.toLocaleString("en-IN")}
                {off > 0 && <s className="ml-1.5 text-xs font-normal text-black/40">₹{CAR.price.toLocaleString("en-IN")}</s>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
