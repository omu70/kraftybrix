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
  add: (product: Product, qty?: number, opts?: { color?: string; material?: string }) => void;
  addBundle: (items: Product[], price: number, label?: string) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  saveForLater: (lineId: string) => void;
  moveToCart: (lineId: string) => void;
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
      add: (product, qty = 1, opts) =>
        set((s) => {
          const color = opts?.color;
          const material = opts?.material;
          const lineId = `${product.id}|${color ?? ""}|${material ?? ""}`;
          const existing = s.lines.find((l) => l.lineId === lineId);
          if (existing) {
            return {
              isOpen: true,
              lines: s.lines.map((l) => (l.lineId === lineId ? { ...l, qty: l.qty + qty } : l)),
            };
          }
          const line: CartLine = {
            lineId,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: effectivePrice(product),
            image: product.images[0]?.url ?? "",
            bodyColor: product.bodyColor,
            qty,
            color,
            material,
          };
          return { isOpen: true, lines: [...s.lines, line] };
        }),
      addBundle: (items, price, label = "Dream Garage Bundle") =>
        set((s) => {
          const id = `bundle-${Date.now()}`;
          const line: CartLine = {
            lineId: id,
            productId: id,
            slug: "bundle",
            name: label,
            price,
            image: items[0]?.images[0]?.url ?? "",
            bodyColor: items[0]?.bodyColor ?? "#FF2D20",
            qty: 1,
            bundleItems: items.map((p) => p.name),
          };
          return { isOpen: true, lines: [...s.lines, line] };
        }),
      remove: (lineId) =>
        set((s) => ({ lines: s.lines.filter((l) => l.lineId !== lineId) })),
      setQty: (lineId, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.lineId === lineId ? { ...l, qty: Math.max(1, qty) } : l))
            .filter((l) => l.qty > 0),
        })),
      saveForLater: (lineId) =>
        set((s) => {
          const line = s.lines.find((l) => l.lineId === lineId);
          if (!line) return s;
          return {
            lines: s.lines.filter((l) => l.lineId !== lineId),
            savedForLater: [...s.savedForLater, line],
          };
        }),
      moveToCart: (lineId) =>
        set((s) => {
          const line = s.savedForLater.find((l) => l.lineId === lineId);
          if (!line) return s;
          return {
            savedForLater: s.savedForLater.filter((l) => l.lineId !== lineId),
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
