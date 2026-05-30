"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, Product } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  savedForLater: CartLine[];
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  saveForLater: (productId: string) => void;
  moveToCart: (productId: string) => void;
  clear: () => void;
  // selectors are computed in components to keep store lean
}

function effectivePrice(p: Product) {
  return p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      savedForLater: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (product, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.productId === product.id);
          if (existing) {
            return {
              isOpen: true,
              lines: s.lines.map((l) =>
                l.productId === product.id ? { ...l, qty: l.qty + qty } : l
              ),
            };
          }
          const line: CartLine = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: effectivePrice(product),
            image: product.images[0]?.url ?? "",
            bodyColor: product.bodyColor,
            qty,
          };
          return { isOpen: true, lines: [...s.lines, line] };
        }),
      remove: (productId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.productId !== productId) })),
      setQty: (productId, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      saveForLater: (productId) =>
        set((s) => {
          const line = s.lines.find((l) => l.productId === productId);
          if (!line) return s;
          return {
            lines: s.lines.filter((l) => l.productId !== productId),
            savedForLater: [...s.savedForLater, line],
          };
        }),
      moveToCart: (productId) =>
        set((s) => {
          const line = s.savedForLater.find((l) => l.productId === productId);
          if (!line) return s;
          return {
            savedForLater: s.savedForLater.filter((l) => l.productId !== productId),
            lines: [...s.lines, line],
          };
        }),
      clear: () => set({ lines: [] }),
    }),
    { name: "kraftybrix-cart" }
  )
);

export const cartCount = (lines: CartLine[]) =>
  lines.reduce((n, l) => n + l.qty, 0);

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((sum, l) => sum + l.price * l.qty, 0);
