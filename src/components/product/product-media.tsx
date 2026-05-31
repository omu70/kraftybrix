"use client";

import { useState } from "react";
import Image from "next/image";
import { Box, ImageIcon } from "lucide-react";
import { ProductViewer } from "@/components/product/product-viewer";
import { BrickCarArt } from "@/components/brand/brick-car-art";
import { cn } from "@/lib/utils";

/** Product hero media: real photo + a toggle into the interactive 3D viewer. */
export function ProductMedia({
  images,
  bodyColor,
  accentColor,
}: {
  images: { url: string; alt: string }[];
  bodyColor: string;
  accentColor: string;
}) {
  const [mode, setMode] = useState<"photo" | "3d">("photo");
  const [err, setErr] = useState(false);
  const photo = images[0]?.url;
  const hasPhoto = !!photo && photo.startsWith("http") && !err;

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-3xl border border-white/5 bg-white shadow-sm"
        style={{ background: `radial-gradient(120% 100% at 30% 8%, ${bodyColor}14, #ffffff 70%)` }}
      >
        {mode === "3d" ? (
          <ProductViewer bodyColor={bodyColor} accentColor={accentColor} />
        ) : hasPhoto ? (
          <Image
            src={photo}
            alt={images[0]?.alt ?? "Product"}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 640px"
            onError={() => setErr(true)}
            className="object-contain p-6"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <BrickCarArt color={bodyColor} className="w-2/3" />
          </div>
        )}
      </div>

      {/* mode switch */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setMode("photo")}
          className={cn(
            "flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition",
            mode === "photo" ? "border-brand-red bg-brand-red text-white" : "border-white/10 text-white/60 hover:border-white/30"
          )}
        >
          <ImageIcon size={16} /> Photo
        </button>
        <button
          onClick={() => setMode("3d")}
          className={cn(
            "flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition",
            mode === "3d" ? "border-brand-red bg-brand-red text-white" : "border-white/10 text-white/60 hover:border-white/30"
          )}
        >
          <Box size={16} /> 360° 3D View
        </button>
      </div>
    </div>
  );
}
