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
  { icon: Award, title: "Collector-grade", body: "Display-worthy detail." },
  { icon: Cog, title: "Precision built", body: "Working parts." },
  { icon: Gem, title: "Premium bricks", body: "Aerospace-grade ABS." },
  { icon: BookOpen, title: "Clear manual", body: "Easy step-by-step." },
  { icon: LayoutGrid, title: "Ready to display", body: "Plinth included." },
  { icon: Truck, title: "Ships in 24h", body: "Free & insured." },
];

export function Why() {
  return (
    <section className="relative border-y border-black/10 bg-ink-800/40 py-16 sm:py-24">
      <div className="container-wide">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> Why KraftyBrix <span className="h-px w-8 bg-brand-red" /></p>
            <h2 className="h-display mt-3 text-4xl sm:text-5xl">Built to a higher standard</h2>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/10 bg-black/[0.04] lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={f.title} i={i}>
              <div className="group h-full bg-ink-900 p-5 transition-colors hover:bg-ink-800 sm:p-8">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-red/10 text-brand-red transition group-hover:bg-brand-red group-hover:text-cream sm:h-12 sm:w-12">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold sm:mt-5 sm:text-lg">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-black/55">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
