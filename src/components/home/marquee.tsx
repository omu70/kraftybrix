"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const ITEMS = [
  "Collector-grade detail",
  "Aerospace-grade ABS bricks",
  "Lifetime brick guarantee",
  "Ships in 24 hours",
  "Partial COD — pay ₹99 now",
  "Free shipping over ₹9,999",
  "3,000+ happy builders",
  "Display plinth in every box",
];

/** Seamless infinite marquee, driven by GSAP. Pauses on hover. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const el = track.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      // The track holds two identical copies, so shifting by -50% loops seamlessly.
      tween.current = gsap.fromTo(
        el,
        { xPercent: 0 },
        { xPercent: -50, duration: 26, ease: "none", repeat: -1 }
      );
    }, track);
    return () => ctx.revert();
  }, []);

  const row = [...ITEMS, ...ITEMS];

  return (
    <section
      className="relative overflow-hidden border-y border-black/10 bg-charcoal py-4 text-white"
      onMouseEnter={() => tween.current?.pause()}
      onMouseLeave={() => tween.current?.resume()}
      aria-hidden
    >
      <div ref={track} className="flex w-max gap-12 whitespace-nowrap will-change-transform">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 text-sm font-medium uppercase tracking-[0.22em] text-white/70">
            {t}
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          </span>
        ))}
      </div>
    </section>
  );
}
