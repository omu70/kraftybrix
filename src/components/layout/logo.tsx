"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Brand logo. Tries /logo.png; if it's missing (not yet added to /public),
 * falls back to a clean wordmark so the header/footer is never broken.
 */
export function Logo({ className = "h-9" }: { className?: string }) {
  const [err, setErr] = useState(false);

  return (
    <Link href="/" aria-label="KraftyBrix home" className="inline-flex items-center">
      {err ? (
        <span className="font-display text-xl font-bold tracking-tight">
          KRAFTY<span className="text-brand-red">BRIX</span>
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/logo.png"
          alt="KraftyBrix"
          onError={() => setErr(true)}
          className={`${className} w-auto object-contain`}
        />
      )}
    </Link>
  );
}
