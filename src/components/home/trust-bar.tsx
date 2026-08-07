import { ShieldCheck, Truck, BadgeIndianRupee, Star, Lock } from "lucide-react";

const items = [
  { icon: Star, title: "4.9 / 5 rating", sub: "3,000+ happy builders" },
  { icon: Truck, title: "Free express shipping", sub: "On orders over ₹999" },
  { icon: BadgeIndianRupee, title: "Partial COD", sub: "Pay ₹99 now, rest on delivery" },
  { icon: ShieldCheck, title: "7-day returns", sub: "Hassle-free & easy" },
  { icon: Lock, title: "100% secure checkout", sub: "UPI · Cards · Netbanking" },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-black/10 bg-ink-900">
      <div className="container-wide">
        <div className="grid grid-cols-2 divide-x divide-black/5 md:grid-cols-3 lg:grid-cols-5">
          {items.map((it) => (
            <div key={it.title} className="flex items-center gap-3 px-5 py-6">
              <it.icon size={24} className="shrink-0 text-brand-red" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-cream">{it.title}</p>
                <p className="text-xs text-black/50">{it.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
