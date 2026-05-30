"use client";

import { BadgeCheck, Quote } from "lucide-react";
import { Stars } from "@/components/ui/stars";

const reviews = [
  { name: "Arjun M.", role: "Collector, Mumbai", text: "The Velocità Rosso is the best display piece I own — and I own die-cast worth 10x. The clutch on these bricks is unreal.", rating: 5 },
  { name: "Priya K.", role: "Gifted to her husband", text: "Bought the R-MAX as an anniversary gift. He didn't speak for 6 hours, just built. Worth every rupee.", rating: 5 },
  { name: "Daniel R.", role: "Content creator", text: "Filmed the whole build. The instructions are cinematic. My most-viewed video this year.", rating: 5 },
  { name: "Sana T.", role: "Architect", text: "Precision is everything to me. The panel gaps on the Apex are tighter than some real cars.", rating: 5 },
  { name: "Vikram S.", role: "Hobbyist", text: "Fourth KraftyBrix kit. The rotating plinth and numbered card make it feel like an actual collectible.", rating: 5 },
  { name: "Megha P.", role: "First build", text: "I'm not a 'car person' but the build was meditative and the result is gorgeous on my shelf.", rating: 5 },
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
          <figcaption className="mt-5 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-red/20 text-sm font-bold text-brand-red">
              {r.name[0]}
            </span>
            <div>
              <p className="flex items-center gap-1 text-sm font-semibold">
                {r.name} <BadgeCheck size={14} className="text-brand-blue" />
              </p>
              <p className="text-xs text-black/45">{r.role}</p>
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
