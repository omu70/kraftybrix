import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { Marquee } from "@/components/home/marquee";
import { Categories } from "@/components/home/categories";
import { BestSellers } from "@/components/home/best-sellers";
import { StatsBand } from "@/components/home/stats-band";
import { BuildExperience } from "@/components/home/build-experience";
import { Community } from "@/components/home/community";
import { Testimonials } from "@/components/home/testimonials";
import { GiftSection } from "@/components/home/gift-section";
import { Newsletter } from "@/components/home/newsletter";

/**
 * Audit-driven flow: hero → trust → categories → best sellers → proof
 * (collector-led) → gift module (parent proof, segmented) → build ritual →
 * community → email capture. Text-heavy filler sections removed.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Marquee />
      <Categories />
      <BestSellers />
      <StatsBand />
      <Testimonials />
      <GiftSection />
      <BuildExperience />
      <Community />
      <Newsletter />
    </>
  );
}
