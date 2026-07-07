"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";

/**
 * Auto delivery estimate. Every product ships in a set window (default 4–5 days);
 * this shows the window plus the actual dated range ("by Mon, 8 Jul – Tue, 9 Jul").
 * Computed on the client to keep the dates current and avoid hydration mismatch.
 */
export function DeliveryEstimate({
  minDays = 4,
  maxDays = 5,
  compact = false,
  className = "",
}: {
  minDays?: number;
  maxDays?: number;
  compact?: boolean;
  className?: string;
}) {
  const [range, setRange] = useState("");

  useEffect(() => {
    const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    const a = new Date(); a.setDate(a.getDate() + minDays);
    const b = new Date(); b.setDate(b.getDate() + maxDays);
    setRange(`${fmt(a)} – ${fmt(b)}`);
  }, [minDays, maxDays]);

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs text-black/50 ${className}`}>
        <Truck size={13} /> {minDays}–{maxDays}-day delivery
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 rounded-xl border border-black/10 bg-ink-800 px-3 py-2.5 text-sm ${className}`}>
      <Truck size={17} className="shrink-0 text-brand-red" />
      <span className="text-black/70">
        Estimated delivery <b className="text-cream">{minDays}–{maxDays} days</b>
        {range && <span className="text-black/45"> · by {range}</span>}
      </span>
    </div>
  );
}
