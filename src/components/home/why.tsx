"use client";

import {
  Award,
  Cog,
  Gem,
  BookOpen,
  LayoutGrid,
  Truck,
} from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const features = [
  { icon: Award, title: "Collector-Grade Designs", body: "Each model is sculpted by automotive designers obsessed with proportion and stance." },
  { icon: Cog, title: "Precision Engineering", body: "Working steering, suspension and doors — engineered to tolerances you can feel." },
  { icon: Gem, title: "High-Quality Bricks", body: "Aerospace-grade ABS with a flawless matte finish and a satisfying clutch." },
  { icon: BookOpen, title: "Detailed Instructions", body: "Hardbound, photographic manuals that make every build a calm, premium ritual." },
  { icon: LayoutGrid, title: "Display-Ready Models", body: "Every kit ships with a rotating plinth and numbered authenticity card." },
  { icon: Truck, title: "Fast, Insured Shipping", body: "Dispatched within 24 hours, fully insured, with lifetime brick replacement." },
];

export function Why() {
  return (
    <section className="relative border-y border-black/10 bg-ink-800/40 py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> Why KraftyBrix <span className="h-px w-8 bg-brand-red" /></p>
            <h2 className="h-display mt-3 text-4xl sm:text-5xl">Obsession, in every brick</h2>
            <p className="mt-4 text-black/60">We don't make toys. We make the centrepiece of your shelf.</p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/[0.04] sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} i={i}>
              <div className="group h-full bg-ink-900 p-8 transition-colors hover:bg-ink-800">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-red/10 text-brand-red transition group-hover:bg-brand-red group-hover:text-cream">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-black/55">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
