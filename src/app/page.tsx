import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { Categories } from "@/components/home/categories";
import { Why } from "@/components/home/why";
import { WhyBuy } from "@/components/home/why-buy";
import { BestSellers } from "@/components/home/best-sellers";
import { BuildExperience } from "@/components/home/build-experience";
import { GarageBuilder } from "@/components/home/garage-builder";
import { Community } from "@/components/home/community";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Categories />
      <Why />
      <BestSellers />
      <WhyBuy />
      <BuildExperience />
      <GarageBuilder />
      <Community />
      <Testimonials />
      <Newsletter />
    </>
  );
}
