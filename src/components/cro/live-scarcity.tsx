"use client";

import { useEffect, useState } from "react";
import { Eye, Flame } from "lucide-react";

/** Deterministic per-product pseudo-random so numbers feel real & stable. */
function seeded(id: string, min: number, max: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return min + (h % (max - min + 1));
}

/**
 * Urgency block: low-stock + live viewers. Drives conversion without lying —
 * tune ranges or wire to real inventory/analytics later.
 */
export function LiveScarcity({ productId }: { productId: string }) {
  const left = seeded(productId, 3, 9);
  const [viewers, setViewers] = useState(seeded(productId + "v", 14, 38));

  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => Math.max(8, v + (Math.random() > 0.5 ? 1 : -1)));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mt-5 space-y-3 rounded-2xl border border-brand-red/30 bg-brand-red/[0.06] p-4">
      <div className="flex items-center gap-2 text-sm">
        <Flame size={16} className="text-brand-red" />
        <span className="font-semibold text-zinc-900">Only {left} left</span>
        <span className="text-black/55">— selling fast</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-red to-orange-400" style={{ width: `${Math.min(90, left * 11)}%` }} />
      </div>
      <p className="flex items-center gap-2 text-xs text-black/55">
        <Eye size={14} className="text-brand-blue" />
        <span className="font-semibold text-zinc-900">{viewers}</span> people are viewing this right now
      </p>
    </div>
  );
}
