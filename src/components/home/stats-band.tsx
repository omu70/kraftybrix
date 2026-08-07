"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 71, decimals: 0, suffix: "+", label: "Collector models" },
  { value: 3000, decimals: 0, suffix: "+", label: "Happy builders" },
  { value: 4.9, decimals: 1, suffix: "★", label: "Average rating" },
  { value: 24, decimals: 0, suffix: "h", label: "Dispatch time" },
];

const fmt = (v: number, d: number) =>
  d ? v.toFixed(d) : Math.round(v).toLocaleString("en-IN");

/**
 * Social-proof band. Renders the REAL numbers immediately (never "0★"), then
 * counts up once on first view as a progressive enhancement.
 */
export function StatsBand() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(1); // 1 = final values by default

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1400;
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / dur);
          setProgress(1 - Math.pow(1 - k, 3));
          if (k < 1) requestAnimationFrame(tick);
        };
        setProgress(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden border-y border-black/10 py-14 sm:py-20">
      <div className="container-wide relative">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-5xl font-bold text-gradient-red sm:text-6xl">
                {fmt(s.value * progress, s.decimals)}
                {s.suffix}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-black/50 sm:text-sm">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
