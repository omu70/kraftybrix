"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { value: 30, decimals: 0, suffix: "+", label: "Collector models" },
  { value: 3000, decimals: 0, suffix: "+", label: "Happy builders" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
  { value: 24, decimals: 0, suffix: "h", label: "Dispatch time" },
];

/** Social-proof band whose numbers count up on scroll via GSAP ScrollTrigger. */
export function StatsBand() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".stat-item", {
        y: 32, opacity: 0, stagger: 0.12, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
      gsap.utils.toArray<HTMLElement>(".stat-num").forEach((el) => {
        const to = parseFloat(el.dataset.to || "0");
        const decimals = parseInt(el.dataset.decimals || "0", 10);
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to, duration: 1.8, ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 78%" },
          onUpdate: () => {
            const formatted = decimals ? obj.v.toFixed(decimals) : Math.round(obj.v).toLocaleString("en-IN");
            el.textContent = formatted + suffix;
          },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden border-y border-black/10 py-20">
      <div className="absolute inset-0 bg-radial-spot opacity-40" />
      <div className="container-wide relative">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="stat-item text-center">
              <p
                className="stat-num font-display text-5xl font-bold text-gradient-red sm:text-6xl"
                data-to={s.value}
                data-decimals={s.decimals}
                data-suffix={s.suffix}
              >
                0{s.suffix}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-black/50 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
