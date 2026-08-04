"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { track } from "@/components/analytics";

/**
 * Runs on the order-confirmed page after a PayU redirect: empties the cart and
 * fires the Purchase pixel. Only fires for the PayU return (Razorpay/demo flows
 * already clear + track on the checkout page), so Purchase never double-counts.
 */
export function ConfirmEffects({ paid, due, payu }: { paid: number; due: number; payu?: boolean }) {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    if (payu) {
      clear();
      track("purchase", { value: paid + due, method: "PAYU" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
