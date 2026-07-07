"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products } from "@/lib/products";

const CAR = products.find((p) => p.category === "Hypercars") ?? products.find((p) => p.bestSeller) ?? products[0];

/**
 * Scroll-scrubbed "drive": the car travels across a light studio road while
 * the lane markings stream past, so it feels like it's moving as you scroll.
 * Light stage so the product's white background blends cleanly (mix-blend).
 */
export function CarDrive() {
  const section = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true }); // avoid mobile address-bar resize jumps
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduce) return;
      gsap.timeline({
        scrollTrigger: { trigger: section.current, start: "top top", end: "+=170%", scrub: 1, pin: true, anticipatePin: 1 },
      })
        .fromTo(".cd-car", { xPercent: -175 }, { xPercent: 175, ease: "none" }, 0)
        .fromTo(".cd-lane", { backgroundPositionX: "0px" }, { backgroundPositionX: "-1600px", ease: "none" }, 0)
        .fromTo(".cd-heading", { opacity: 0, y: 26 }, { opacity: 1, y: 0, ease: "power2.out", duration: 0.25 }, 0.05);
      // wheels/road wobble for life
      gsap.to(".cd-car", { y: "-=6", duration: 0.5, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      className="relative min-h-[100svh] overflow-hidden"
      style={{ background: "linear-gradient(180deg,#F4EEE4 0%,#ffffff 62%,#eef1f6 100%)" }}
    >
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 28%, rgba(245,166,35,0.12), transparent 70%)" }} />

      <div className="container-wide relative flex min-h-[100svh] flex-col justify-center">
        <div className="cd-heading max-w-xl">
          <p className="eyebrow"><span className="h-px w-8 bg-brand-red" /> Built to move</p>
          <h2 className="h-display mt-3 text-4xl sm:text-6xl">Engineered down to the last brick</h2>
          <p className="mt-4 text-black/55">Scroll to take it for a drive.</p>
        </div>
      </div>

      {/* road + streaming lane markings */}
      <div className="absolute inset-x-0 bottom-[19%] h-px bg-black/10" />
      <div
        className="cd-lane absolute inset-x-0 bottom-[18%] h-1.5"
        style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.16) 0 54px, transparent 54px 120px)", backgroundSize: "120px 100%" }}
      />

      {/* the car drives on the road */}
      <div className="cd-car pointer-events-none absolute bottom-[19%] left-1/2 w-[62%] max-w-2xl -translate-x-1/2 will-change-transform sm:w-[44%]">
        <Image src={CAR.images[0].url} alt={CAR.name} width={900} height={560} className="w-full object-contain mix-blend-multiply" />
        <div className="mx-auto -mt-[5%] h-4 w-3/4 rounded-[100%] bg-black/25 blur-md" />
      </div>
    </section>
  );
}
