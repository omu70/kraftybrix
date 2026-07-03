import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function Page() {
  return (
    <PolicyPage title="Privacy Policy">
      <p>KraftyBrix respects your privacy. This policy explains what we collect and why.</p>
      <h2>What we collect</h2>
      <p>Your name, email, phone, and shipping address to fulfil orders; payment is processed securely by Razorpay — we never store your card details.</p>
      <h2>How we use it</h2>
      <p>To process and deliver orders, send order updates, provide support, and — only if you opt in — share new drops and offers.</p>
      <h2>Sharing</h2>
      <p>We share data only with the partners needed to run the store: our courier, Razorpay (payments), and email provider. We never sell your data.</p>
      <h2>Your rights</h2>
      <p>Email <a href="mailto:hello@kraftybrix.com">hello@kraftybrix.com</a> anytime to access, correct, or delete your data, or to unsubscribe.</p>
    </PolicyPage>
  );
}
