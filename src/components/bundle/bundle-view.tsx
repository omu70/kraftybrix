"use client";

import { useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Gift, Sparkles, ShoppingBag, Flame } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { track } from "@/components/analytics";

/** Reusable "pick N cars for one price" bundle builder. */
export function BundleView({
  pick,
  price,
  eligible,
  eyebrow,
  title,
  subtitle,
  label,
  hidePrices = false,
}: {
  pick: number;
  price: number;
  eligible: Product[];
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  label: string;
  /** Hide per-product prices — the bundle price is the only price that matters. */
  hidePrices?: boolean;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const addBundle = useCart((s) => s.addBundle);

  const toggle = (id: string) =>
    setPicked((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < pick ? [...cur, id] : cur
    );

  const chosen = eligible.filter((p) => picked.includes(p.id));
  const normalTotal = useMemo(() => chosen.reduce((s, p) => s + (p.salePrice ?? p.price), 0), [chosen]);
  const savings = Math.max(0, normalTotal - price);
  const complete = picked.length === pick;

  function addToCart() {
    if (!complete) return;
    addBundle(chosen, price, label);
    track("add_to_cart", { value: price, bundle: true });
    setPicked([]);
  }

  return (
    <div className="pt-24">
      <section className="relative overflow-hidden bg-charcoal py-16 text-white">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 40%, rgba(245,166,35,0.18), transparent 70%)" }} />
        <div className="container-wide relative text-center">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
            <Flame size={14} /> {eyebrow}
          </p>
          <h1 className="h-display mt-4 text-4xl sm:text-6xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/65">{subtitle}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/55">
            <span className="flex items-center gap-1.5"><Check size={15} className="text-brand-gold" /> Save big vs buying separately</span>
            <span className="flex items-center gap-1.5"><Gift size={15} className="text-brand-gold" /> Perfect gift set</span>
            <span className="flex items-center gap-1.5"><Sparkles size={15} className="text-brand-gold" /> Free express shipping</span>
          </div>
        </div>
      </section>

      <section className="container-wide pb-40 pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Pick your {pick}</h2>
          <span className="text-sm text-black/55">{picked.length}/{pick} selected</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {eligible.map((p) => {
            const isPicked = picked.includes(p.id);
            const disabled = !isPicked && picked.length >= pick;
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                disabled={disabled}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border bg-white p-3 text-left transition-all",
                  isPicked ? "border-brand-red ring-2 ring-brand-red/30" : "border-black/10 hover:border-black/30",
                  disabled && "opacity-40"
                )}
              >
                <span className={cn("absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-full border transition", isPicked ? "border-brand-red bg-brand-red text-white" : "border-black/20 bg-white")}>
                  {isPicked && <Check size={14} />}
                </span>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl" style={{ background: `radial-gradient(120% 100% at 30% 10%, ${p.bodyColor}14, #ffffff 70%)` }}>
                  <Image src={p.images[0].url} alt={p.name} fill sizes="240px" className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="mt-2 line-clamp-1 text-sm font-semibold">{p.name}</p>
                {!hidePrices && (
                  <p className="text-xs text-black/45 line-through">{formatPrice(p.salePrice ?? p.price)}</p>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {picked.length > 0 && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} transition={{ type: "spring", damping: 26, stiffness: 260 }} className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-ink-800/95 backdrop-blur-xl">
            <div className="container-wide flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {chosen.map((p) => (
                    <span key={p.id} className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-white" style={{ background: `${p.bodyColor}15` }}>
                      <Image src={p.images[0].url} alt="" width={44} height={44} className="object-contain p-1" />
                    </span>
                  ))}
                  {Array.from({ length: pick - picked.length }).map((_, i) => (
                    <span key={i} className="grid h-11 w-11 place-items-center rounded-full border-2 border-dashed border-black/20 bg-ink-900 text-xs text-black/40">+</span>
                  ))}
                </div>
                <div>
                  <p className="font-display font-bold">{complete ? "Bundle ready!" : `Pick ${pick - picked.length} more`}</p>
                  <p className="text-sm text-black/55">
                    <span className="font-semibold text-cream">{formatPrice(price)}</span>
                    {!hidePrices && savings > 0 && <span className="ml-2 text-green-600">save {formatPrice(savings)}</span>}
                    {!hidePrices && normalTotal > 0 && <span className="ml-2 text-black/40 line-through">{formatPrice(normalTotal)}</span>}
                  </p>
                </div>
              </div>
              <button onClick={addToCart} disabled={!complete} className="flex items-center gap-2 rounded-full bg-brand-red text-white px-8 py-3.5 font-semibold shadow-glow transition hover:brightness-110 disabled:opacity-50">
                <ShoppingBag size={18} /> Add bundle · {formatPrice(price)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
