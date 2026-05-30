"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, BadgeIndianRupee, Star, Lock } from "lucide-react";

const items = [
  { icon: Star, title: "4.9 / 5 rating", sub: "3,000+ happy builders" },
  { icon: Truck, title: "Free express shipping", sub: "On orders over ₹9,999" },
  { icon: BadgeIndianRupee, title: "Cash on Delivery", sub: "Pay when it arrives" },
  { icon: ShieldCheck, title: "Lifetime guarantee", sub: "Free brick replacement" },
  { icon: Lock, title: "100% secure checkout", sub: "Razorpay · UPI · Cards" },
];

export function TrustBar() {
  return (
    <section className="relative border-y border-black/10 bg-white">
      <div className="container-wide">
        <div className="grid grid-cols-2 divide-x divide-black/5 md:grid-cols-3 lg:grid-cols-5">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex items-center gap-3 px-5 py-6"
            >
              <it.icon size={26} className="shrink-0 text-brand-red" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-zinc-900">{it.title}</p>
                <p className="text-xs text-black/50">{it.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
