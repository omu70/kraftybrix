import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy";
export const metadata: Metadata = { title: "Shipping & Delivery" };
export default function Page() {
  return (
    <PolicyPage title="Shipping & Delivery">
      <p>We dispatch every KraftyBrix order within 24 hours of confirmation, fully insured, in protective packaging.</p>
      <h2>Delivery time</h2>
      <p>Standard delivery across India takes 2–5 business days. Metro cities are usually quicker. You’ll receive a tracking link by email and SMS once your order ships.</p>
      <h2>Shipping charges</h2>
      <p>Flat ₹199 shipping on orders below ₹9,999. Orders of ₹9,999 and above ship free via express courier.</p>
      <h2>Cash on Delivery</h2>
      <p>COD is available nationwide. Please keep the exact amount ready for the delivery partner.</p>
      <h2>Delays</h2>
      <p>Occasionally couriers are delayed by weather or regional disruptions. If your order hasn’t moved in 5 business days, email <a href="mailto:hello@kraftybrix.com">hello@kraftybrix.com</a> and we’ll chase it for you.</p>
    </PolicyPage>
  );
}
