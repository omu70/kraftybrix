"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/lib/products";
import { Button } from "@/components/ui/button";

const CAR = products.find((p) => p.bestSeller) ?? products[0];
const COLS = 8;
const ROWS = 6;
const TILES = Array.from({ length: COLS * ROWS }, (_, i) => ({ c: i % COLS, r: Math.floor(i / COLS) }));

/**
 * Scroll-scrubbed "assembly" section: image tiles start scattered and click
 * together into the finished car as you scroll. Pinned, so it plays out over
 * scroll distance — works great on mobile. Falls back to the finished image
 * when the visitor prefers reduced motion.
 */
export function BrickBuild() {
  const section = useRef<HTMLElement>(null);
  const pct = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const bricks = gsap.utils.toArray<HTMLElement>(".brick");
      gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=160%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => { if (pct.current) pct.current.textContent = `${Math.round(self.progress * 100)}%`; },
        },
      }).from(bricks, {
        x: () => gsap.utils.random(-280, 280),
        y: () => gsap.utils.random(-220, 220),
        rotation: () => gsap.utils.random(-100, 100),
        scale: 0.2,
        opacity: 0,
        ease: "power2.out",
        stagger: { each: 0.02, from: "random" },
      }, 0);
    }, section);
    return () => ctx.revert();
  }, []);

  const img = CAR.images[0]?.url;

  return (
    <section ref={section} className="relative overflow-hidden bg-ink-900">
      <div className="container-wide flex min-h-screen flex-col items-center justify-center py-20">
        <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> Brick by brick</p>
        <h2 className="h-display mt-3 text-center text-4xl sm:text-5xl">Watch it come together</h2>
        <p className="mt-3 max-w-md text-center text-black/55">Every kit clicks into a display-ready icon. Keep scrolling to build it.</p>

        <div className="relative mt-10 aspect-[4/3] w-full max-w-3xl">
          {img && TILES.map(({ c, r }, i) => (
            <div
              key={i}
              className="brick absolute rounded-[3px] mix-blend-multiply"
              style={{
                left: `${(c / COLS) * 100}%`,
                top: `${(r / ROWS) * 100}%`,
                width: `${100 / COLS}%`,
                height: `${100 / ROWS}%`,
                backgroundImage: `url(${img})`,
                backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
                backgroundRepeat: "no-repeat",
              }}
            />
          ))}
        </div>

        <p className="mt-8 text-sm text-black/50">
          <span className="font-display text-2xl font-bold text-gradient-red"><span ref={pct}>0%</span></span> assembled
        </p>
        <Link href={`/product/${CAR.slug}`} className="mt-6"><Button size="lg">Build the {CAR.name}</Button></Link>
      </div>
    </section>
  );
}
