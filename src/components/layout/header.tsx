"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, User, Menu, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, cartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { Magnetic } from "@/components/ui/magnetic";

const nav = [
  { label: "Collection", href: "/collection" },
  { label: "3 for ₹1999", href: "/bundle" },
  { label: "Hypercars", href: "/collection?category=Hypercars" },
  { label: "Smoking Cars", href: "/collection?category=Smoking+Cars" },
  { label: "The Build", href: "/#build" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.ids.length);
  const count = cartCount(lines);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 border-b backdrop-blur-xl",
        scrolled ? "border-black/10 bg-ink-900/90 shadow-sm" : "border-transparent bg-ink-900/80"
      )}
    >
      {/* Announcement bar */}
      <div className="bg-brand-red text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white py-1.5">
        Free express shipping over ₹9,999 · Lifetime brick guarantee
      </div>

      <div className="container-wide flex h-16 items-center justify-between gap-6">
        <Logo className="h-10" />

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Magnetic key={item.label} strength={0.2}>
              <Link
                href={item.href}
                className="text-sm font-medium text-black/75 transition-colors hover:text-cream"
              >
                {item.label}
              </Link>
            </Magnetic>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-black/75 transition hover:bg-black/[0.04] hover:text-cream"
          >
            <Search size={19} />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-10 w-10 place-items-center rounded-full text-black/75 transition hover:bg-black/[0.04] hover:text-cream sm:grid"
          >
            <User size={19} />
          </Link>
          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full text-black/75 transition hover:bg-black/[0.04] hover:text-cream"
          >
            <Heart size={19} />
            {wishCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-blue text-white px-1 text-[10px] font-bold">
                {wishCount}
              </span>
            )}
          </Link>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative grid h-10 w-10 place-items-center rounded-full text-cream transition hover:bg-black/[0.04]"
          >
            <ShoppingBag size={19} />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-red text-white px-1 text-[10px] font-bold"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-10 w-10 place-items-center rounded-full text-cream lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-black/10 bg-ink-900/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container-wide flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-black/80 hover:bg-black/[0.04]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
