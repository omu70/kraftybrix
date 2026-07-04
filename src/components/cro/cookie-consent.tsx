"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Privacy-preserving cookie consent. Offers "Essential only" as an equal choice
 * and remembers the visitor's decision. Analytics should read this value before firing.
 */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("kb-cookie-consent")) setShow(true);
  }, []);

  const choose = (v: "all" | "essential") => {
    try { localStorage.setItem("kb-cookie-consent", v); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[85] mx-auto max-w-2xl rounded-2xl border border-black/10 bg-ink-800/95 p-4 shadow-card backdrop-blur-xl sm:flex sm:items-center sm:gap-4">
      <p className="text-sm text-black/70">
        We use cookies to run the store and improve your experience. Read our{" "}
        <Link href="/cookies" className="font-medium text-brand-red hover:underline">Cookie Policy</Link>.
      </p>
      <div className="mt-3 flex shrink-0 gap-2 sm:mt-0">
        <button onClick={() => choose("essential")} className="rounded-full border border-black/15 px-4 py-2 text-sm font-medium transition hover:bg-black/[0.04]">
          Essential only
        </button>
        <button onClick={() => choose("all")} className="rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
          Accept all
        </button>
      </div>
    </div>
  );
}
