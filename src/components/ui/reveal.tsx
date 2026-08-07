"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll reveal that CANNOT hide content.
 *
 * Content renders visible by default (server HTML + no-JS + reduced-motion all
 * show it). Only after mount, if the element is still below the fold, do we
 * play a short fade/slide in. A safety timer guarantees visibility even if the
 * observer never fires — a section must never be permanently invisible.
 */
export function Reveal({
  children,
  i = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  i?: number;
  className?: string;
  as?: "div" | "section" | "li" | "span";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate things that start off-screen; anything already visible stays put.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) return;

    setState("hidden");
    const show = () => setState("shown");
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { show(); io.disconnect(); } },
      { threshold: 0.05 }
    );
    io.observe(el);
    const failsafe = setTimeout(show, 2500); // never stay hidden
    return () => { io.disconnect(); clearTimeout(failsafe); };
  }, []);

  const style: React.CSSProperties =
    state === "hidden"
      ? { opacity: 0, transform: "translateY(24px)" }
      : {
          opacity: 1,
          transform: "none",
          transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${i * 0.06}s, transform .6s cubic-bezier(.16,1,.3,1) ${i * 0.06}s`,
        };

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
