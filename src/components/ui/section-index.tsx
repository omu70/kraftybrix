import type { ReactNode } from "react";

/**
 * Editorial chapter header — a numbered index label + oversized display title.
 * Gives the page a magazine rhythm (01, 02, 03…) instead of repeated section cards.
 */
export function SectionIndex({
  index,
  label,
  title,
  className = "",
}: {
  index: string;
  label: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-4 font-display text-[11px] uppercase tracking-[0.25em] text-black/45">
        <span className="text-brand-red">{index}</span>
        <span className="h-px w-10 bg-black/20" />
        <span>{label}</span>
      </div>
      <h2 className="mt-4 font-archivo text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">
        {title}
      </h2>
    </div>
  );
}
