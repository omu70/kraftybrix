"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, Truck, RotateCcw, BadgeIndianRupee, Gift, Wrench, Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

const reasons = [
  {
    icon: Wrench,
    title: "Hours of screen-free flow",
    body: "Hundreds of precision ABS bricks and a clear photo manual. The build is the experience — calm, addictive, deeply satisfying.",
  },
  {
    icon: Gift,
    title: "A gift they'll never forget",
    body: "Not another gadget that gets shelved. They build their dream car by hand, then display it forever. Birthdays, anniversaries, car lovers — sorted.",
  },
  {
    icon: Sparkles,
    title: "Display-ready, collector-grade",
    body: "Tight panel gaps, accurate stance, real detailing. It looks like a premium collectible on your desk — because it is one.",
  },
];

const promises = [
  { icon: ShieldCheck, label: "Lifetime brick guarantee" },
  { icon: Truck, label: "Free express shipping ₹9,999+" },
  { icon: BadgeIndianRupee, label: "Cash on Delivery" },
  { icon: RotateCcw, label: "30-day easy returns" },
];

export function WhyBuy() {
  return (
    <section className="relative py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center">
              <span className="h-px w-8 bg-brand-red" /> Why buy a KraftyBrix
            </p>
            <h2 className="h-display mt-3 text-4xl sm:text-5xl text-balance">
              The car you can't afford —{" "}
              <span className="text-gradient-red">built by your own hands</span>
            </h2>
            <p className="mt-4 text-white/60">
              Real supercars cost crores. A KraftyBrix lets you build, own and display the icon —
              for the price of a night out.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} i={i}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group h-full rounded-3xl border border-white/10 bg-ink-800 p-8 shadow-sm transition-shadow hover:shadow-card"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-red/10 text-brand-red transition group-hover:bg-brand-red group-hover:text-white">
                  <r.icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{r.body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Risk reversal — kills the "what if" objection */}
        <Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((p) => (
              <div key={p.label} className="flex items-center gap-3 bg-ink-800 px-6 py-5">
                <p.icon size={22} className="shrink-0 text-brand-red" />
                <span className="text-sm font-medium text-cream">{p.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/collection">
              <Button size="lg">Start your collection</Button>
            </Link>
            <span className="text-sm text-white/50">
              ⭐ 4.9/5 from 3,000+ happy builders
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
