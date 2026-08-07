import { ShieldCheck, Truck, BadgeIndianRupee, Lock } from "lucide-react";

const items = [
  { icon: Truck, label: "Free shipping over ₹999" },
  { icon: BadgeIndianRupee, label: "Partial COD — pay ₹99 now" },
  { icon: ShieldCheck, label: "7-day easy returns" },
  { icon: Lock, label: "100% secure checkout" },
];

/** Slim icon + text trust strip. */
export function TrustBar() {
  return (
    <section className="border-y border-black/10 bg-ink-900">
      <div className="container-wide">
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 py-4 sm:gap-x-14">
          {items.map((it) => (
            <li key={it.label} className="flex items-center gap-2 whitespace-nowrap">
              <it.icon size={17} className="shrink-0 text-brand-red" />
              <span className="text-[13px] font-medium text-black/70 sm:text-sm">{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
