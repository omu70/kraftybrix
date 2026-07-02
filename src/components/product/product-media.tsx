"use client";

import { useState } from "react";
import Image from "next/image";
import { BrickCarArt } from "@/components/brand/brick-car-art";
import { cn } from "@/lib/utils";

/** Product hero media — clean photo gallery (thumbnails when multiple images). */
export function ProductMedia({
  images,
  bodyColor,
}: {
  images: { url: string; alt: string }[];
  bodyColor: string;
  accentColor?: string;
}) {
  const gallery = images.filter((i) => i.url?.startsWith("http"));
  const [active, setActive] = useState(0);
  const [err, setErr] = useState(false);
  const current = gallery[active];
  const hasPhoto = !!current && !err;

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-3xl border border-black/10 shadow-sm"
        style={{ background: `radial-gradient(120% 100% at 30% 8%, ${bodyColor}12, #ffffff 70%)` }}
      >
        {hasPhoto ? (
          <Image
            src={current.url}
            alt={current.alt ?? "Product"}
            fill
            priority
            sizes="(max-width:1024px) 100vw, 640px"
            onError={() => setErr(true)}
            className="mix-blend-multiply object-contain p-8"
          />
        ) : (
          <div className="grid h-full place-items-center">
            <BrickCarArt color={bodyColor} className="w-2/3" />
          </div>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 flex gap-3">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setActive(i);
                setErr(false);
              }}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-xl border bg-white transition",
                i === active ? "border-brand-red" : "border-black/10 hover:border-black/30"
              )}
            >
              <Image src={img.url} alt={img.alt} fill sizes="80px" className="mix-blend-multiply object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
