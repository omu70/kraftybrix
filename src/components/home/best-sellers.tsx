"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getBestSellers } from "@/lib/products";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";

export function BestSellers() {
  const root = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const items = getBestSellers();

  const scrollBy = (dir: number) => {
    scroller.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".bs-card", {
        y: 48, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: scroller.current, start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative py-24">
      <div className="container-wide">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow"><span className="h-px w-8 bg-brand-red" /> Most wanted</p>
              <h2 className="h-display mt-3 text-4xl sm:text-5xl">Best sellers</h2>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button onClick={() => scrollBy(-1)} aria-label="Previous" className="grid h-11 w-11 place-items-center rounded-full border border-black/15 hover:border-black/40">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scrollBy(1)} aria-label="Next" className="grid h-11 w-11 place-items-center rounded-full border border-black/15 hover:border-black/40">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>

        <div
          ref={scroller}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((p) => (
            <div key={p.id} className="bs-card w-[300px] shrink-0 snap-start sm:w-[330px]">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 text-center">
            <Link href="/collection">
              <Button variant="outline" size="lg">View all models</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
