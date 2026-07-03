"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, Bookmark, ShoppingBag } from "lucide-react";
import { useCart, cartSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrickCarArt } from "@/components/brand/brick-car-art";

const FREE_SHIP_THRESHOLD = 9999;

export function CartDrawer() {
  const {
    isOpen,
    close,
    lines,
    setQty,
    remove,
    saveForLater,
    savedForLater,
    moveToCart,
  } = useCart();
  const subtotal = cartSubtotal(lines);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col border-l border-black/10 bg-ink-800"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <h2 className="font-display text-lg font-bold">
                Your Garage Cart{" "}
                <span className="text-muted">({lines.length})</span>
              </h2>
              <button onClick={close} aria-label="Close cart" className="text-black/60 hover:text-cream">
                <X size={22} />
              </button>
            </div>

            {/* Free shipping progress — CRO nudge */}
            {lines.length > 0 && (
              <div className="border-b border-black/10 px-6 py-4">
                <p className="text-xs text-black/70">
                  {remaining > 0 ? (
                    <>
                      Add <span className="font-semibold text-cream">{formatPrice(remaining)}</span> for{" "}
                      <span className="text-brand-red">free express shipping</span>
                    </>
                  ) : (
                    <span className="text-brand-red font-semibold">🎉 You've unlocked free express shipping!</span>
                  )}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
                  <div
                    className="h-full rounded-full bg-brand-red transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {lines.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 text-black/20" size={48} />
                  <p className="text-black/60">Your cart is empty.</p>
                  <Button className="mt-6" onClick={close} variant="secondary">
                    Continue building
                  </Button>
                </div>
              ) : (
                <ul className="space-y-5">
                  {lines.map((l) => (
                    <li key={l.productId} className="flex gap-4">
                      <Link
                        href={`/product/${l.slug}`}
                        onClick={close}
                        className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10"
                        style={{ background: `radial-gradient(circle at 30% 25%, ${l.bodyColor}33, #f3f5f8)` }}
                      >
                        <BrickCarArt color={l.bodyColor} shadow={false} className="w-[88%]" />
                      </Link>
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between gap-2">
                          <Link href={`/product/${l.slug}`} onClick={close} className="font-medium leading-tight hover:text-brand-red">
                            {l.name}
                          </Link>
                          <span className="font-semibold">{formatPrice(l.price * l.qty)}</span>
                        </div>
                        {l.bundleItems && (
                          <p className="mt-1 text-xs text-black/50">Includes: {l.bundleItems.join(" · ")}</p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-black/15">
                            <button onClick={() => setQty(l.productId, l.qty - 1)} className="grid h-8 w-8 place-items-center text-black/70 hover:text-cream" aria-label="Decrease">
                              <Minus size={14} />
                            </button>
                            <span className="w-7 text-center text-sm">{l.qty}</span>
                            <button onClick={() => setQty(l.productId, l.qty + 1)} className="grid h-8 w-8 place-items-center text-black/70 hover:text-cream" aria-label="Increase">
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3 text-black/50">
                            <button onClick={() => saveForLater(l.productId)} title="Save for later" className="hover:text-brand-blue">
                              <Bookmark size={16} />
                            </button>
                            <button onClick={() => remove(l.productId)} title="Remove" className="hover:text-brand-red">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {savedForLater.length > 0 && (
                <div className="mt-8">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
                    Saved for later
                  </h3>
                  <ul className="space-y-3">
                    {savedForLater.map((l) => (
                      <li key={l.productId} className="flex items-center justify-between text-sm">
                        <span className="text-black/70">{l.name}</span>
                        <button onClick={() => moveToCart(l.productId)} className="text-brand-blue hover:underline">
                          Move to cart
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-black/10 px-6 py-5">
                <div className="mb-1 flex justify-between text-sm text-black/60">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <p className="mb-4 text-xs text-black/40">Taxes & shipping calculated at checkout.</p>
                <Link href="/checkout" onClick={close}>
                  <Button size="lg" className="w-full">
                    Secure Checkout · {formatPrice(subtotal)}
                  </Button>
                </Link>
                <button onClick={close} className="mt-3 w-full text-center text-xs text-black/50 hover:text-cream">
                  Continue building
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
