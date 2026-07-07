// Shared store constants (safe to import from both server and client).

/** Upfront amount (₹) collected online to confirm a Partial COD order. */
export const ADVANCE_FEE = 99;

/**
 * Homepage hero banner image URL. Paste your banner link here (e.g. an ImageKit
 * URL). Leave "" to use the built-in gradient hero. Recommended size ~2000×1100.
 */
export const HERO_BANNER = "";

/** Free shipping kicks in at this order value (₹). */
export const FREE_SHIPPING_THRESHOLD = 999;

/** Flat shipping fee below the free-shipping threshold (₹). */
export const SHIPPING_FEE = 49;

/** Active discount codes. Single source of truth for checkout + admin. */
export const COUPONS: Record<string, { type: "PERCENT" | "FIXED"; value: number }> = {
  BRICK10: { type: "PERCENT", value: 10 },
  WELCOME500: { type: "FIXED", value: 500 },
};
