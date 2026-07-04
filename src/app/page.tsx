import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { Marquee } from "@/components/home/marquee";
import { Categories } from "@/components/home/categories";
import { BrickBuild } from "@/components/home/brick-build";
import { Why } from "@/components/home/why";
import { WhyBuy } from "@/components/home/why-buy";
import { BestSellers } from "@/components/home/best-sellers";
import { StatsBand } from "@/components/home/stats-band";
import { CarDrive } from "@/components/home/car-drive";
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
      <Marquee />
      <Categories />
      <BrickBuild />
      <BestSellers />
      <StatsBand />
      <CarDrive />
      <Why />
      <WhyBuy />
      <BuildExperience />
      <GarageBuilder />
      <Community />
      <Testimonials />
      <Newsletter />
    </>
  );
}
