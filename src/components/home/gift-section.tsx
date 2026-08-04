"use client";

import Link from "next/link";
import { Gift, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/ui/stars";

/**
 * Segmented gifting proof — parent/gifting reviews live here, away from the
 * collector testimonials, so each audience gets its own story.
 */
const giftReviews = [
  { name: "Shreya Nair", text: "My son absolutely loved the car! The quality is amazing — keeps him engaged for hours, away from screens." },
  { name: "Rahul Verma", text: "Gifted it to my nephew and he was thrilled. Quality aur design dono excellent hain — best gift I've given in years." },
  { name: "Kavita Rao", text: "Bought one for my husband and one for my son. Building it together became their Sunday ritual." },
];

export function GiftSection() {
  return (
    <section className="container-wide py-16 sm:py-24">
      <div className="overflow-hidden rounded-3xl border border-black/10 bg-ink-800">
        <div className="grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="eyebrow"><Gift size={14} /> The perfect gift</p>
            <h2 className="h-display mt-3 text-3xl sm:text-4xl">A gift they&apos;ll actually keep</h2>
            <p className="mt-4 max-w-md text-black/60">
              Birthdays, Diwali, Rakhi — a build they&apos;ll spend hours on and display
              for years. Gift-ready boxes, from ₹499.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/collection"><Button>Find a gift</Button></Link>
              <Link href="/bundle" className="inline-flex items-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black/70 transition hover:border-black/35">
                Gift bundles →
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {giftReviews.map((r) => (
              <figure key={r.name} className="rounded-2xl border border-black/10 bg-ink-900 p-5">
                <Stars rating={5} size={13} />
                <blockquote className="mt-3 text-sm leading-relaxed text-black/70">“{r.text}”</blockquote>
                <figcaption className="mt-4 flex items-center gap-1 text-sm font-semibold">
                  {r.name} <BadgeCheck size={13} className="text-brand-blue" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
