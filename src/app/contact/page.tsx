import type { Metadata } from "next";
import { Mail, Instagram, Clock } from "lucide-react";
import { PolicyPage } from "@/components/layout/policy";
export const metadata: Metadata = { title: "Contact Us" };
export default function Page() {
  return (
    <PolicyPage title="Contact us">
      <p>We’re a small, obsessive team and we answer fast. Reach us any of these ways:</p>
      <div className="not-prose mt-6 grid gap-4 sm:grid-cols-2">
        <a href="mailto:hello@kraftybrix.com" className="flex items-center gap-3 rounded-2xl border border-black/10 bg-ink-800 p-5 hover:border-brand-red">
          <Mail className="text-brand-red" /> <span><span className="block font-semibold text-cream">Email</span>hello@kraftybrix.com</span>
        </a>
        <a href="https://instagram.com/kraftybrix" className="flex items-center gap-3 rounded-2xl border border-black/10 bg-ink-800 p-5 hover:border-brand-red">
          <Instagram className="text-brand-red" /> <span><span className="block font-semibold text-cream">Instagram</span>@kraftybrix</span>
        </a>
      </div>
      <p className="mt-6 flex items-center gap-2 text-sm text-black/55"><Clock size={16} /> Support hours: Mon–Sat, 10am–7pm IST. We reply within one business day.</p>
    </PolicyPage>
  );
}
