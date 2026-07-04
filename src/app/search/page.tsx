import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchView } from "@/components/search/search-view";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the KraftyBrix collection of brick-built supercars, hypercars, JDM legends and more.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-wide pt-40 text-black/50">Loading search…</div>}>
      <SearchView />
    </Suspense>
  );
}
