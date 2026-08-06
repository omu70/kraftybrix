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
  { label: "All Cars", href: "/collection" },
  { label: "Block Cars", href: "/collection?category=Block+Cars" },
  { label: "Die-Cast", href: "/collection?category=Die-Cast+Cars" },
  { label: "RC Cars", href: "/collection?category=RC+Cars" },
  { label: "Bundles", href: "/bundle" },
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

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 border-b backdrop-blur-xl",
        scrolled ? "border-black/10 bg-ink-900/90 shadow-sm" : "border-transparent bg-ink-900/80"
      )}
    >
      {/* Announcement bar */}
      <div className="bg-brand-red text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white py-1.5">
        Free express shipping over ₹999 · Easy 7-day returns
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
          <Link
            href="/search"
            aria-label="Search"
            className="grid h-10 w-10 place-items-center rounded-full text-black/75 transition hover:bg-black/[0.04] hover:text-cream"
          >
            <Search size={19} />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="hidden h-10 w-10 place-items-center rounded-full text-black/75 transition hover:bg-black/[0.04] hover:text-cream sm:grid"
          >
            <User size={19} />
          </Link>
          <Link
            href="/wishlist"
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
          <>
            {/* scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[98] bg-black/60 lg:hidden"
            />
            {/* solid slide-in drawer */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 z-[99] flex w-[85%] max-w-sm flex-col bg-white shadow-2xl lg:hidden"
              aria-label="Menu"
            >
              <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                <span className="font-display text-lg font-bold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="grid h-11 w-11 place-items-center rounded-full bg-black/[0.05]"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4">
                {nav.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-4 text-lg font-semibold text-ink-900 text-black/85 active:bg-black/[0.06]"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-black/10 pt-4">
                  <Link href="/search" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-black/70 active:bg-black/[0.06]">
                    <Search size={19} /> Search
                  </Link>
                  <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-black/70 active:bg-black/[0.06]">
                    <User size={19} /> Account
                  </Link>
                  <Link href="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium text-black/70 active:bg-black/[0.06]">
                    <Heart size={19} /> Wishlist
                  </Link>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
