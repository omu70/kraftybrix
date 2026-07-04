import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How KraftyBrix uses cookies and similar technologies.",
};

export default function Page() {
  return (
    <PolicyPage title="Cookie Policy">
      <p>This policy explains how KraftyBrix uses cookies and similar technologies when you visit our store.</p>
      <h2>What cookies are</h2>
      <p>Cookies are small text files stored on your device that help a website work and remember your preferences, such as the contents of your cart.</p>
      <h2>How we use them</h2>
      <p>We use essential cookies to run the store (your cart, checkout and security), and optional analytics cookies to understand how the store is used so we can improve it. We do not sell your data.</p>
      <h2>Managing cookies</h2>
      <p>You can control or delete cookies through your browser settings. Blocking essential cookies may stop parts of the store — like checkout — from working.</p>
      <h2>Questions</h2>
      <p>Email <a href="mailto:hello@kraftybrix.com">hello@kraftybrix.com</a> and we&apos;ll be happy to help.</p>
    </PolicyPage>
  );
}
