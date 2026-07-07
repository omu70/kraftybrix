import type { Metadata } from "next";
import { PolicyPage } from "@/components/layout/policy";

export const metadata: Metadata = {
  title: "About KraftyBrix",
  description: "KraftyBrix builds collector-grade, brick-built automotive models for enthusiasts who never stop dreaming.",
};

export default function Page() {
  return (
    <PolicyPage title="About KraftyBrix">
      <p>KraftyBrix builds collector-grade automotive models, brick by brick. Every kit is engineered to capture the proportions, stance and soul of the cars enthusiasts love — then finished to a standard that looks at home on any desk or shelf.</p>
      <h2>Why we started</h2>
      <p>We were tired of choosing between toys that felt cheap and display models that cost a fortune. So we built a third option: precise, premium brick kits with working details, clear instructions and a price that respects you.</p>
      <h2>What makes a KraftyBrix</h2>
      <p>Aerospace-grade ABS bricks with tight, satisfying clutch. Reference-accurate silhouettes. A display plinth in every box.</p>
      <h2>Built for builders</h2>
      <p>From first-time builders to seasoned collectors, every kit is graded for difficulty and build time so you always know what you&apos;re getting into. The journey is half the joy.</p>
      <p>Questions or ideas? We&apos;d love to hear from you at <a href="mailto:hello@kraftybrix.com">hello@kraftybrix.com</a>.</p>
    </PolicyPage>
  );
}
