"use client";

import Image from "next/image";
import { BadgeCheck, Quote } from "lucide-react";
import { Stars } from "@/components/ui/stars";
import { galleryImages } from "@/lib/products";

const gimgs = galleryImages(8);

const reviews = [
  { name: "Shreya Nair", role: "Verified buyer", text: "My son absolutely loved the car! The quality is amazing and the design is very attractive. Keeps him engaged for hours.", rating: 5 },
  { name: "Vikram Joshi", role: "Verified buyer", text: "Yeh car bahut mast hai! Build quality bhi achi hai aur bachchon ko bahut pasand aati hai. Totally worth it.", rating: 5 },
  { name: "Neha Gupta", role: "Verified buyer", text: "I was surprised by how durable it is. Even after rough use it still looks perfect. Great product!", rating: 5 },
  { name: "Karan Malhotra", role: "Verified buyer", text: "Finishing bahut achi hai, aur colors bhi bahut attractive hain. Mere bachche ko bahut pasand aayi.", rating: 5 },
  { name: "Priya Mehta", role: "Verified buyer", text: "Exceeded my expectations. Sturdy body and very satisfying to build. Highly recommend.", rating: 5 },
  { name: "Amit Singh", role: "Verified buyer", text: "Bahut hi zabardast hai. Bachche iske saath bahut enjoy karte hain aur quality bhi premium lagti hai.", rating: 5 },
  { name: "Sneha Patil", role: "Verified buyer", text: "The detailing is impressive. Looks great and made with strong material. Definitely recommended.", rating: 5 },
  { name: "Rahul Verma", role: "Verified buyer", text: "Mere nephew ko gift ki thi, aur usse bahut pasand aayi. Quality aur design dono excellent hain.", rating: 5 },
  { name: "Ananya Iyer", role: "Verified buyer", text: "A very fun and reliable build. Safe, durable, and gives great value for money.", rating: 5 },
  { name: "Rohit Sharma", role: "Verified buyer", text: "Bahut badhiya! Price ke hisaab se quality excellent hai aur bachche khush ho jaate hain.", rating: 5 },
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
    <section className="relative overflow-hidden border-y border-black/10 bg-ink-800/40 py-16 sm:py-24">
      <div className="container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> 12,000+ verified buyers</p>
          <h2 className="h-display mt-3 text-4xl sm:text-5xl">Loved by enthusiasts</h2>
        </div>
      </div>

      <div className="mt-14 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <Row />
      </div>
    </section>
  );
}
