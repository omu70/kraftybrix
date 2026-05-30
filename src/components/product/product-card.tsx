"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn, formatPrice, discountPct } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { Badge } from "@/components/ui/badge";
import { BrickCarArt } from "@/components/brand/brick-car-art";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { track } from "@/components/analytics";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [imgError, setImgError] = useState(false);
  const photo = product.images[0]?.url;
  const hasPhoto = !!photo && photo.startsWith("http") && !imgError;

  const off = discountPct(product.price, product.salePrice);
  const effPrice = product.salePrice ?? product.price;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ rx: -py * 8, ry: px * 10 });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      style={{ transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
      className="group relative rounded-2xl border border-black/10 bg-ink-800 p-3 transition-shadow duration-300 hover:border-black/20 hover:shadow-card"
    >
      {/* badges */}
      <div className="absolute left-5 top-5 z-10 flex flex-col gap-1.5">
        {off > 0 && <Badge tone="red">-{off}%</Badge>}
        {product.isNew && <Badge tone="blue">New</Badge>}
        {product.limited && <Badge tone="gold">Limited</Badge>}
      </div>

      {/* wishlist */}
      <button
        onClick={() => toggleWish(product.id)}
        aria-label="Toggle wishlist"
        className={cn(
          "absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-ink-900/70 backdrop-blur transition",
          wished ? "text-brand-red" : "text-black/60 hover:text-zinc-900"
        )}
      >
        <Heart size={16} className={wished ? "fill-brand-red" : ""} />
      </button>

      {/* visual */}
      <Link href={`/product/${product.slug}`}>
        <div
          className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl"
          style={{ background: `radial-gradient(120% 100% at 30% 8%, ${product.bodyColor}1f, #ffffff 70%)` }}
        >
          {/* subtle stud-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle, rgba(15,18,25,0.5) 1px, transparent 1.4px)", backgroundSize: "18px 18px" }}
          />
          {/* real product photo, with brick-car illustration as graceful fallback */}
          {hasPhoto ? (
            <Image
              src={photo}
              alt={product.images[0]?.alt ?? product.name}
              fill
              sizes="(max-width:768px) 50vw, 330px"
              onError={() => setImgError(true)}
              className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.08]"
            />
          ) : (
            <BrickCarArt
              color={product.bodyColor}
              className="relative w-[82%] drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.08] group-hover:-rotate-1"
            />
          )}

          {/* quick view on hover */}
          <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-black/[0.06] py-2 text-xs font-medium backdrop-blur">
              <Eye size={14} /> Quick view
            </span>
          </div>
        </div>
      </Link>

      {/* meta */}
      <div className="px-2 pb-1 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-muted">{product.category}</span>
          <Stars rating={product.rating} count={product.reviewCount} size={12} />
        </div>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight hover:text-brand-red">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 text-sm text-black/50">{product.pieces.toLocaleString("en-IN")} pieces</p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold">{formatPrice(effPrice)}</span>
            {off > 0 && <span className="text-sm text-black/40 line-through">{formatPrice(product.price)}</span>}
          </div>
          <button
            onClick={() => {
              add(product);
              track("add_to_cart", { id: product.id, value: effPrice });
            }}
            disabled={!product.inStock}
            aria-label="Add to cart"
            className="grid h-10 w-10 place-items-center rounded-full bg-brand-red text-white transition hover:brightness-110 disabled:bg-black/[0.06] disabled:text-black/40"
          >
            <ShoppingBag size={17} />
          </button>
        </div>
        {!product.inStock && (
          <p className="mt-2 text-xs font-medium text-brand-blue">Notify me when back in stock</p>
        )}
      </div>
    </motion.div>
  );
}
