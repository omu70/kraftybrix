"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscribeNewsletter } from "@/app/actions/newsletter";

export function Newsletter() {
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  async function action(formData: FormData) {
    setPending(true);
    try {
      await subscribeNewsletter(formData);
      setDone(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="relative py-28">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800 p-10 sm:p-16">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-red/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="eyebrow"><span className="h-px w-8 bg-brand-red" /> The drop list</p>
              <h2 className="h-display mt-3 text-4xl sm:text-5xl text-balance">
                Get early access to every new drop
              </h2>
              <p className="mt-4 max-w-md text-white/60">
                Limited editions sell out in hours. Subscribers get a 24-hour head start, plus an exclusive welcome offer.
              </p>
            </div>

            {done ? (
              <div className="flex items-center gap-3 rounded-2xl border border-brand-red/40 bg-brand-red/10 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-red text-white">
                  <Check size={20} />
                </span>
                <p className="font-medium">You're on the list. Check your inbox for your welcome offer.</p>
              </div>
            ) : (
              <form action={action} className="space-y-3">
                <input
                  name="name"
                  required
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/15 bg-ink-900 px-5 py-4 text-sm outline-none transition focus:border-brand-red"
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-white/15 bg-ink-900 px-5 py-4 text-sm outline-none transition focus:border-brand-red"
                />
                <Button type="submit" size="lg" disabled={pending} className="w-full group">
                  {pending ? "Joining…" : "Join the drop list"}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-center text-xs text-white/40">No spam. Unsubscribe anytime.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
