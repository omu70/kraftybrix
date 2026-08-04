"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Copy, Check } from "lucide-react";
import { BrickCarArt } from "@/components/brand/brick-car-art";
import { captureLead } from "@/app/actions/newsletter";

/**
 * First-visit lead-capture offer. Captures email (+ optional phone) to a
 * subscriber, then reveals the discount code. Fires on exit-intent OR after
 * 12s, once per visitor (localStorage). Hidden on /admin and /checkout.
 */
export function PromoModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname?.startsWith("/admin") || pathname?.startsWith("/checkout")) return;
    if (localStorage.getItem("kb-lead-seen")) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
      localStorage.setItem("kb-lead-seen", "1");
    };
    const timer = setTimeout(fire, 12000);
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
    document.addEventListener("mouseout", onLeave);
    return () => { clearTimeout(timer); document.removeEventListener("mouseout", onLeave); };
  }, [pathname]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const res = await captureLead({ email, phone, source: "popup" });
      if (res.ok) setDone(true);
      else setErr(res.error ?? "Something went wrong.");
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const copy = () => {
    navigator.clipboard?.writeText("BRICK10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-black/10 bg-ink-800"
          >
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 z-10 text-black/50 hover:text-cream">
              <X size={22} />
            </button>
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-red/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-blue/25 blur-3xl" />

            <div className="relative px-8 pb-8 pt-10 text-center">
              <BrickCarArt color="#FF2D20" shadow={false} className="mx-auto w-40" />
              <p className="eyebrow justify-center"><Gift size={14} className="text-brand-red" /> First build offer</p>

              {!done ? (
                <>
                  <h2 className="h-display mt-3 text-4xl">
                    Get <span className="text-gradient-red">10% off</span><br />your first model
                  </h2>
                  <p className="mt-3 text-black/60">Drop your email and we&apos;ll send your code instantly. Join 12,000+ collectors.</p>
                  <form onSubmit={submit} className="mt-6 space-y-3 text-left">
                    <input
                      type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email" autoComplete="email"
                      className="w-full rounded-xl border border-black/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red"
                    />
                    <input
                      type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone (optional — for order updates)" autoComplete="tel"
                      className="w-full rounded-xl border border-black/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red"
                    />
                    {err && <p className="text-xs text-brand-red">{err}</p>}
                    <button type="submit" disabled={busy} className="w-full rounded-full bg-brand-red text-white px-8 py-4 font-semibold shadow-glow transition hover:brightness-110 disabled:opacity-60">
                      {busy ? "Sending…" : "Send my 10% code"}
                    </button>
                  </form>
                  <button onClick={() => setOpen(false)} className="mt-3 text-xs text-black/40 hover:text-cream">No thanks, I&apos;ll pay full price</button>
                </>
              ) : (
                <>
                  <h2 className="h-display mt-3 text-4xl">You&apos;re in! 🏁</h2>
                  <p className="mt-3 text-black/60">Here&apos;s your code — we&apos;ve emailed it too.</p>
                  <button onClick={copy} className="group mx-auto mt-6 flex items-center gap-3 rounded-xl border border-dashed border-brand-red/60 bg-brand-red/10 px-6 py-3 font-display text-lg font-bold tracking-wider">
                    BRICK10 {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} className="text-black/60 group-hover:text-cream" />}
                  </button>
                  <a href="/collection" onClick={() => setOpen(false)} className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand-red text-white px-8 py-4 font-semibold shadow-glow transition hover:brightness-110">
                    Claim &amp; shop the collection
                  </a>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
