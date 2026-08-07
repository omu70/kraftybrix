import { buildKits } from "@/lib/products";
import { BundleView } from "@/components/bundle/bundle-view";

// Build-kit bundle — cars that come as brick kits (pieces to assemble).
export default function BundlePage() {
  return (
    <BundleView
      pick={3}
      price={2199}
      eligible={buildKits()}
      eyebrow="Build-kit bundle"
      label="3-Kit Garage Bundle"
      hidePrices
      title={
        <>
          Any 3 build kits.{" "}
          <span className="bg-gradient-to-r from-white to-brand-gold bg-clip-text text-transparent">One price. ₹2,199.</span>
        </>
      }
      subtitle="Pick any three brick-build cars and snap together your dream garage. Mix supercars, hypercars, racers and more."
    />
  );
}
