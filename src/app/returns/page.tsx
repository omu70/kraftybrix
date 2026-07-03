import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy";
export const metadata: Metadata = { title: "Returns & Refunds" };
export default function Page() {
  return (
    <PolicyPage title="Returns & Refunds">
      <p>We want you to love your build. If something isn’t right, here’s how we make it right.</p>
      <h2>30-day returns</h2>
      <p>Unopened kits can be returned within 30 days of delivery for a full refund. The kit must be in original, sealed condition.</p>
      <h2>Damaged or missing pieces</h2>
      <p>Every kit is covered by our lifetime brick guarantee. If a piece is missing or defective, send a photo and your order number to <a href="mailto:hello@kraftybrix.com">hello@kraftybrix.com</a> and we’ll ship replacements free — no return needed.</p>
      <h2>How to start a return</h2>
      <p>Email us with your order number and reason. We’ll arrange a pickup and process your refund to the original payment method within 5–7 business days of receiving the item.</p>
      <h2>Non-returnable</h2>
      <p>Opened or partially built kits (except under the brick guarantee) and gift cards cannot be returned.</p>
    </PolicyPage>
  );
}
