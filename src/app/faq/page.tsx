import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy";

export const metadata: Metadata = {
  title: "FAQ — Frequently Asked Questions",
  description: "Answers about shipping, Partial COD, returns, build difficulty and brick compatibility at KraftyBrix.",
};

export default function Page() {
  return (
    <PolicyPage title="Frequently Asked Questions">
      <h2>What is Partial COD?</h2>
      <p>Pay a small ₹99 advance online to confirm your order, then pay the remaining balance in cash when it&apos;s delivered. It&apos;s the fastest way to order with confidence — or you can pay the full amount online via UPI, cards or netbanking.</p>

      <h2>How long does delivery take?</h2>
      <p>Orders are dispatched within 24 hours. Standard delivery across India takes 2–5 business days, with metro cities usually quicker. You&apos;ll get a tracking link by email once your order ships.</p>

      <h2>How much is shipping?</h2>
      <p>Free shipping on orders of ₹999 and above. A flat ₹49 applies below that.</p>

      <h2>Can I return a kit?</h2>
      <p>Yes — we offer 30-day hassle-free returns on unopened kits. See our <a href="/returns">Returns policy</a> for details.</p>

      <h2>Are the bricks compatible with other brands?</h2>
      <p>Our bricks use the standard clutch system, so they&apos;re compatible with most major building-block brands.</p>

      <h2>How hard are the builds?</h2>
      <p>Every model is graded Beginner, Intermediate, Advanced or Master, with an estimated build time on the product page, so you always know what to expect.</p>

      <h2>What if a piece is missing or faulty?</h2>
      <p>Every kit is covered by our lifetime brick guarantee. Email <a href="mailto:hello@kraftybrix.com">hello@kraftybrix.com</a> and we&apos;ll send a free replacement.</p>
    </PolicyPage>
  );
}
