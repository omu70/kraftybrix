"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Count-up that RENDERS THE FINAL VALUE BY DEFAULT (SSR/no-JS safe — never
 * shows "0★"). When it scrolls into view it briefly animates up to the value
 * as a progressive enhancement. Honors prefers-reduced-motion.
 */
export function Counter({
  to,
  duration = 1.4,
  suffix = "",
  className,
}: {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(to); // default = final value, not 0

  useEffect(() => {
    if (!inView) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
