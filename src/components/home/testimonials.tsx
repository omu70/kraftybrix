"use client";

import Image from "next/image";
import { BadgeCheck, Quote } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { galleryImages } from "@/lib/products";

const gimgs = galleryImages(8);

// Collector-led proof. Gifting/parent reviews live in the "Perfect gift"
// module — mixing them here downgraded the premium positioning.
const reviews = [
  { name: "Vikram Joshi", role: "Verified builder", text: "Finally have a Lambo on my desk. Build quality solid hai — bricks snap tight aur finish premium lagti hai. Totally worth it.", rating: 5 },
  { name: "Priya Mehta", role: "Verified builder", text: "Exceeded my expectations. The build was genuinely satisfying — a whole weekend of calm, and now it sits on my shelf like a trophy.", rating: 5 },
  { name: "Rohit Sharma", role: "Verified collector", text: "Price ke hisaab se detailing excellent hai. My third KraftyBrix — the die-cast 1:24s look brilliant next to the block builds.", rating: 5 },
  { name: "Sneha Patil", role: "Verified builder", text: "The detailing is impressive — vents, spoiler, even the interior. Photographs beautifully. My desk setup is complete.", rating: 5 },
  { name: "Amit Singh", role: "Verified collector", text: "Zabardast quality. Display karne layak finish hai — office walon ne poocha kahan se liya.", rating: 5 },
  { name: "Ananya Iyer", role: "Verified builder", text: "A very absorbing build — great value for the piece count. Better than doom-scrolling, and I got a Ferrari out of it.", rating: 5 },
  { name: "Neha Gupta", role: "Verified buyer", text: "Surprisingly durable. Moved house with it fully built and it still looks perfect on the bookshelf.", rating: 5 },
  { name: "Karan Malhotra", role: "Verified collector", text: "Finishing bahut achi hai aur colours attractive hain. The 1:32 die-cast smoking car is my favourite piece.", rating: 5 },
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
    <section className="relative overflow-hidden border-y border-black/10 bg-ink-700 py-16 sm:py-24">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> 12,000+ verified buyers</p>
          <h2 className="h-display mt-3 text-4xl sm:text-5xl">Built by collectors</h2>
        </div>
      </div>

      <div className="mt-14 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row />
      </div>
    </section>
  );
}
