import { readyBuilt } from "@/lib/products";
import { BundleView } from "@/components/bundle/bundle-view";

// Ready-built bundle — pre-assembled metal cars, no building required.
export default function ReadyBundlePage() {
  return (
    <BundleView
      pick={4}
      price={1999}
      eligible={readyBuilt()}
      eyebrow="Ready-built bundle"
      label="4-Car Display Bundle"
      title={
        <>
          Any 4 ready-built cars.{" "}
          <span className="bg-gradient-to-r from-white to-brand-gold bg-clip-text text-transparent">One price. ₹1,999.</span>
        </>
      }
      subtitle="Pick any four pre-assembled metal cars — no building needed. Straight out of the box and onto your shelf."
    />
  );
}
