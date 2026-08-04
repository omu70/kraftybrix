"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Heart, Zap, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import type { Product, ColorOption } from "@/lib/types";
import { formatPrice, discountPct } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { track } from "@/components/analytics";
import { DeliveryEstimate } from "@/components/product/delivery-estimate";

export function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [color, setColor] = useState<ColorOption | null>(product.colorOptions?.[0] ?? null);
  const [material, setMaterial] = useState<string | null>(product.materialOptions?.[0] ?? null);
  const add = useCart((s) => s.add);
  const router = useRouter();
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));

  const off = discountPct(product.price, product.salePrice);
  const price = product.salePrice ?? product.price;
  const opts = { color: color?.name, material: material ?? undefined };

  function addToCart() {
    add(product, qty, opts);
    track("add_to_cart", { id: product.id, qty, value: price * qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }
  function buyNow() {
    add(product, qty, opts);
    track("begin_checkout", { id: product.id, value: price * qty });
    router.push("/checkout");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="neutral">{product.category}</Badge>
        {product.limited && <Badge tone="gold">Limited Edition</Badge>}
        {product.isNew && <Badge tone="blue">New</Badge>}
      </div>

      <h1 className="h-display mt-4 text-4xl sm:text-5xl">{product.name}</h1>
      <p className="mt-2 text-lg text-black/60">{product.tagline}</p>

      <div className="mt-4 flex items-center gap-4">
        <Stars rating={product.rating} count={product.reviewCount} />
        <a href="#reviews" className="text-sm text-brand-blue hover:underline">Read reviews</a>
      </div>

      <div className="mt-6 flex items-end gap-3">
        <span className="font-display text-4xl font-bold">{formatPrice(price)}</span>
        {off > 0 && (
          <>
            <span className="pb-1 text-lg text-black/40 line-through">{formatPrice(product.price)}</span>
            <span className="pb-1 font-semibold text-brand-red">Save {off}%</span>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-black/45">Inclusive of all taxes · EMI from {formatPrice(Math.round(price / 6))}/mo</p>

      {product.colorOptions && product.colorOptions.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium">Colour{color ? `: ${color.name}` : ""}</p>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {product.colorOptions.map((c) => (
              <button
                key={c.name + c.hex}
                onClick={() => setColor(c)}
                title={c.name}
                aria-label={c.name}
                className={`h-9 w-9 rounded-full border-2 transition ${color?.name === c.name ? "border-brand-red ring-2 ring-brand-red/30" : "border-black/15 hover:border-black/40"}`}
                style={{ background: c.hex || "#ccc" }}
              />
            ))}
          </div>
        </div>
      )}

      {product.materialOptions && product.materialOptions.length > 1 && (
        <div className="mt-5">
          <p className="text-sm font-medium">Body material</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.materialOptions.map((m) => (
              <button
                key={m}
                onClick={() => setMaterial(m)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${material === m ? "border-brand-red bg-brand-red/10 text-brand-red" : "border-black/15 hover:border-black/30"}`}
              >
                {m} body
              </button>
            ))}
          </div>
        </div>
      )}

      {/* availability */}
      <div className="mt-5 flex items-center gap-2 text-sm">
        <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-green-400" : "bg-black/20"}`} />
        {product.inStock ? (
          <span className="text-green-400">In stock — ships within 24 hours</span>
        ) : (
          <span className="text-black/50">Out of stock</span>
        )}
      </div>

      {/* auto delivery estimate */}
      <DeliveryEstimate className="mt-4" />

      {/* qty + actions */}
      <div className="mt-7 flex items-center gap-3">
        <div className="flex items-center rounded-full border border-black/15">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-black/70 hover:text-cream" aria-label="Decrease">
            <Minus size={16} />
          </button>
          <span className="w-10 text-center font-semibold">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center text-black/70 hover:text-cream" aria-label="Increase">
            <Plus size={16} />
          </button>
        </div>
        <Button size="lg" onClick={addToCart} disabled={!product.inStock} className="flex-1">
          {added ? <>Added ✓</> : <><ShoppingBag size={18} /> Add to cart</>}
        </Button>
        <button
          onClick={() => toggleWish(product.id)}
          aria-label="Wishlist"
          className={`grid h-12 w-12 place-items-center rounded-full border border-black/15 transition ${wished ? "text-brand-red" : "text-black/60 hover:text-cream"}`}
        >
          <Heart size={18} className={wished ? "fill-brand-red" : ""} />
        </button>
      </div>

      <Button size="lg" variant="outline" onClick={buyNow} disabled={!product.inStock} className="mt-3 w-full">
        <Zap size={18} /> Buy now
      </Button>

      {/* trust row — CRO */}
      <div className="mt-7 grid grid-cols-3 gap-3 border-t border-black/10 pt-6 text-center">
        {[
          { icon: ShieldCheck, label: "100% secure checkout" },
          { icon: Truck, label: "Free insured shipping" },
          { icon: RotateCcw, label: "30-day returns" },
        ].map((t) => (
          <div key={t.label} className="flex flex-col items-center gap-2">
            <t.icon size={20} className="text-brand-red" />
            <span className="text-xs text-black/55">{t.label}</span>
          </div>
        ))}
      </div>

      {/* payment methods at the decision point */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {["UPI", "Visa", "Mastercard", "RuPay", "COD"].map((m) => (
          <span key={m} className="rounded-md border border-black/10 bg-white px-2.5 py-1 text-[11px] font-semibold text-black/60">
            {m}
          </span>
        ))}
      </div>

      {/* mobile sticky add-to-cart bar (premium mobile pattern) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-black/10 bg-ink-900/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="truncate text-[11px] text-black/50">{product.name}</p>
          <p className="font-display font-bold leading-tight">
            {formatPrice(price)}
            {off > 0 && <span className="ml-1 text-xs font-normal text-black/40 line-through">{formatPrice(product.price)}</span>}
          </p>
        </div>
        <Button size="lg" onClick={addToCart} disabled={!product.inStock} className="ml-auto flex-1">
          {added ? <>Added ✓</> : <><ShoppingBag size={18} /> Add to cart</>}
        </Button>
      </div>
    </div>
  );
}
