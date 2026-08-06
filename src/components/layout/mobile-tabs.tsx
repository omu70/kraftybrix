"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Gift, Heart, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart, cartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";

/**
 * App-style bottom tab bar for mobile. Always-visible primary navigation —
 * hidden on desktop, on /admin, and on checkout (which has its own flow).
 */
export function MobileTabs() {
  const pathname = usePathname() ?? "/";
  const lines = useCart((s) => s.lines);
  const openCart = useCart((s) => s.open);
  const count = cartCount(lines);
  const wishCount = useWishlist((s) => s.ids.length);

  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) return null;

  const tabs = [
    { href: "/", label: "Home", icon: Home, active: pathname === "/" },
    { href: "/collection", label: "Shop", icon: LayoutGrid, active: pathname.startsWith("/collection") || pathname.startsWith("/product") },
    { href: "/bundle", label: "Bundles", icon: Gift, active: pathname.startsWith("/bundle") },
    { href: "/wishlist", label: "Saved", icon: Heart, active: pathname.startsWith("/wishlist"), badge: wishCount },
  ];

  return (
    <>
      {/* spacer so page content never hides behind the bar */}
      <div className="h-[68px] lg:hidden" aria-hidden />
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-[45] border-t border-black/10 bg-ink-900/95 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition",
                t.active ? "text-brand-red" : "text-black/55"
              )}
            >
              <t.icon size={21} strokeWidth={t.active ? 2.4 : 1.9} />
              {t.label}
              {!!t.badge && t.badge > 0 && (
                <span className="absolute right-[22%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-blue px-1 text-[10px] font-bold text-white">
                  {t.badge}
                </span>
              )}
            </Link>
          ))}
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-black/55"
          >
            <ShoppingBag size={21} strokeWidth={1.9} />
            Cart
            {count > 0 && (
              <span className="absolute right-[22%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
