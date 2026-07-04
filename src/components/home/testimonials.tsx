"use client";

import Image from "next/image";
import { BadgeCheck, Quote } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { galleryImages } from "@/lib/products";

const gimgs = galleryImages(8);

const reviews = [
  { name: "Arjun M.", role: "Mumbai", text: "Best display piece I own. Unreal quality.", rating: 5 },
  { name: "Priya K.", role: "Gift buyer", text: "Perfect anniversary gift. Worth every rupee.", rating: 5 },
  { name: "Daniel R.", role: "Creator", text: "So fun to build. My most-viewed video this year.", rating: 5 },
  { name: "Sana T.", role: "Architect", text: "Tighter panel gaps than some real cars.", rating: 5 },
  { name: "Vikram S.", role: "Collector", text: "My 4th kit. Feels like a real collectible.", rating: 5 },
  { name: "Megha P.", role: "First build", text: "Relaxing to build, gorgeous on my shelf.", rating: 5 },
];

function Row({ reverse }: { reverse?: boolean }) {
  const list = reverse ? [...reviews].reverse() : reviews;
  return (
    <div className="flex w-max animate-marquee gap-5" style={reverse ? { animationDirection: "reverse" } : undefined}>
      {[...list, ...list].map((r, i) => (
        <figure key={i} className="w-[360px] shrink-0 rounded-2xl border border-black/10 bg-ink-800 p-6">
          <div className="flex items-center justify-between">
            <Stars rating={r.rating} size={14} />
            <Quote className="text-black/15" size={26} />
          </div>
          <blockquote className="mt-4 text-sm leading-relaxed text-black/75">“{r.text}”</blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10 bg-white">
              <Image src={gimgs[i % gimgs.length].url} alt={gimgs[i % gimgs.length].name} fill sizes="44px" className="mix-blend-multiply object-contain p-1" />
            </span>
            <div>
              <p className="flex items-center gap-1 text-sm font-semibold">
                {r.name} <BadgeCheck size={14} className="text-brand-blue" />
              </p>
              <p className="text-xs text-black/45">{gimgs[i % gimgs.length].name}</p>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y border-black/10 bg-ink-800/40 py-24">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> 12,000+ verified buyers</p>
          <h2 className="h-display mt-3 text-4xl sm:text-5xl">Loved by enthusiasts</h2>
        </div>
      </div>

      <div className="mt-14 space-y-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
