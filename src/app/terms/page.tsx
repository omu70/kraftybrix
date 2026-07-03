import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy";
export const metadata: Metadata = { title: "Terms of Service" };
export default function Page() {
  return (
    <PolicyPage title="Terms of Service">
      <p>By using kraftybrix.com and placing an order, you agree to these terms.</p>
      <h2>Products</h2>
      <p>KraftyBrix models are collector building sets recommended for ages 14+. Small parts present a choking hazard for young children. Images are representative; colours may vary slightly.</p>
      <h2>Orders & pricing</h2>
      <p>All prices are in INR and inclusive of applicable taxes. We reserve the right to cancel orders in cases of pricing errors or suspected fraud, with a full refund.</p>
      <h2>Intellectual property</h2>
      <p>All site content, designs, and the KraftyBrix name are our property. Product names referencing real vehicles are used descriptively; KraftyBrix is not affiliated with any car manufacturer.</p>
      <h2>Contact</h2>
      <p>Questions? Reach us at <a href="mailto:hello@kraftybrix.com">hello@kraftybrix.com</a>.</p>
    </PolicyPage>
  );
}
