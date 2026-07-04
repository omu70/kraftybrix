// Shared store constants (safe to import from both server and client).

/** Upfront amount (₹) collected online to confirm a Partial COD order. */
export const ADVANCE_FEE = 99;

/** Free shipping kicks in at this order value (₹). */
export const FREE_SHIPPING_THRESHOLD = 9999;

/** Flat shipping fee below the free-shipping threshold (₹). */
export const SHIPPING_FEE = 199;

/** Active discount codes. Single source of truth for checkout + admin. */
export const COUPONS: Record<string, { type: "PERCENT" | "FIXED"; value: number }> = {
  BRICK10: { type: "PERCENT", value: 10 },
  WELCOME500: { type: "FIXED", value: 500 },
};
