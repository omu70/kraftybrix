"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="container-wide grid min-h-screen place-items-center pt-28 pb-16">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-black/10 bg-ink-800 p-8">
          <h1 className="h-display text-3xl">{mode === "login" ? "Welcome back" : "Create account"}</h1>
          <p className="mt-2 text-sm text-black/55">
            {mode === "login" ? "Sign in to your garage." : "Join the KraftyBrix collectors club."}
          </p>

          {/* Google */}
          <button
            onClick={() => { /* signIn("google") */ }}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-black/15 py-3 text-sm font-medium transition hover:bg-black/[0.04]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"/><path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 6.68 9.14 4.75 12 4.75Z"/></svg>
            Continue with Google
          </button>

          <div className="my-6 flex items-center gap-4 text-xs text-black/35">
            <span className="hairline" /> or <span className="hairline" />
          </div>

          <form className="space-y-3">
            {mode === "register" && (
              <input placeholder="Full name" className="w-full rounded-xl border border-black/15 bg-ink-900 px-4 py-3 text-sm outline-none focus:border-brand-red" />
            )}
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
              <input type="email" placeholder="Email" className="w-full rounded-xl border border-black/15 bg-ink-900 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-red" />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/40" />
              <input type="password" placeholder="Password" className="w-full rounded-xl border border-black/15 bg-ink-900 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-red" />
            </div>
            <Button type="submit" size="lg" className="w-full group">
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-black/50">
            {mode === "login" ? "New to KraftyBrix? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold text-brand-red hover:underline">
              {mode === "login" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-black/40">
          Prefer not to sign in? <Link href="/checkout" className="text-brand-blue hover:underline">Guest checkout</Link> is always available.
        </p>
      </div>
    </div>
  );
}
