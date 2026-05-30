import { Suspense } from "react";
import type { Metadata } from "next";
import { CollectionView } from "@/components/collection/collection-view";

export const metadata: Metadata = {
  title: "Collection — All Brick-Built Models",
  description:
    "Browse the full KraftyBrix collection of collector-grade brick-built supercars, hypercars, JDM legends and more. Advanced filtering by category, price and difficulty.",
};

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="container-wide pt-40 text-black/50">Loading collection…</div>}>
      <CollectionView />
    </Suspense>
  );
}
