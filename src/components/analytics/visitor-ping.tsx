"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Sends a lightweight visitor heartbeat so the admin can show who's live. */
export function VisitorPing() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const ping = () => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => {});
    };
    ping();
    const id = setInterval(() => { if (!document.hidden) ping(); }, 30000);
    return () => clearInterval(id);
  }, [pathname]);
  return null;
}
