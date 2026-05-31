"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import type { Product } from "@/lib/types";

const faqs = [
  { q: "Are the bricks compatible with other brands?", a: "Yes — our ABS bricks are fully compatible with all major brick systems, so you can customise and combine freely." },
  { q: "How long does the build take?", a: "It varies by model. Each product page lists an estimated build time, ranging from 4 to 9+ focused hours." },
  { q: "What if I'm missing or break a piece?", a: "Every kit is covered by our lifetime brick guarantee. We'll ship replacements free, forever." },
  { q: "Do you ship internationally?", a: "We ship across India with free insured express delivery over ₹9,999, and to 40+ countries worldwide." },
];

export function ProductTabs({ product }: { product: Product }) {
  const [tab, setTab] = useState("Description");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const tabs = ["Description", "Specifications", "What's Included", "Shipping", "FAQs"];

  return (
    <div className="mt-20">
      <div className="flex flex-wrap gap-1 border-b border-black/10">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-5 py-3 text-sm font-medium transition"
          >
            <span className={tab === t ? "text-cream" : "text-black/50 hover:text-black/80"}>{t}</span>
            {tab === t && (
              <motion.span layoutId="tab-underline" className="absolute inset-x-3 -bottom-px h-0.5 bg-brand-red" />
            )}
          </button>
        ))}
      </div>

      <div className="py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {tab === "Description" && (
              <p className="max-w-3xl text-black/70 leading-relaxed">{product.description}</p>
            )}

            {tab === "Specifications" && (
              <dl className="grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/[0.04] sm:grid-cols-2">
                {product.specs.map((s) => (
                  <div key={s.label} className="bg-ink-900 px-5 py-4">
                    <dt className="text-xs uppercase tracking-wider text-black/40">{s.label}</dt>
                    <dd className="mt-1 font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {tab === "What's Included" && (
              <ul className="max-w-2xl space-y-3">
                {product.whatsIncluded.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-black/75">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-red/15 text-brand-red">
                      <Check size={14} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {tab === "Shipping" && (
              <div className="max-w-2xl space-y-4 text-black/70">
                <p>Orders are dispatched within 24 hours via insured express courier. Free shipping on orders over ₹9,999.</p>
                <p>Standard delivery: 2–5 business days across India. International delivery: 7–14 business days to 40+ countries.</p>
                <p>Cash on Delivery available nationwide. 30-day hassle-free returns on unopened kits.</p>
              </div>
            )}

            {tab === "FAQs" && (
              <div className="max-w-2xl divide-y divide-black/10">
                {faqs.map((f, i) => (
                  <div key={i} className="py-4">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between text-left">
                      <span className="font-medium">{f.q}</span>
                      <ChevronDown size={18} className={`shrink-0 text-black/50 transition ${openFaq === i ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden text-sm text-black/60"
                        >
                          <span className="block pt-3">{f.a}</span>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
