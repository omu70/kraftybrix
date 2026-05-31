"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Play, Share2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { galleryImages } from "@/lib/products";

const handles = ["@apex_collector", "@jdm_garage_in", "@brickspeed", "@shelf.icons", "@nocturne.build", "@summit.overland"];
const likeCounts = [1284, 2031, 877, 1540, 3110, 642];
const posts = galleryImages(6).map((g, i) => ({
  ...g,
  user: handles[i] ?? "@kraftybrix",
  likes: likeCounts[i] ?? 500,
  video: i === 1 || i === 4,
}));

export function Community() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  return (
    <section id="community" className="relative py-24">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow"><span className="h-px w-8 bg-brand-red" /> #BuiltWithKraftyBrix</p>
              <h2 className="h-display mt-3 text-4xl sm:text-5xl">From the community</h2>
            </div>
            <a href="#" className="text-sm font-semibold text-brand-red hover:underline">Follow @kraftybrix →</a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {posts.map((p, i) => (
            <Reveal key={i} i={i}>
              <div
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10"
                style={{ background: `radial-gradient(120% 100% at 50% 0%, ${p.color}1f, #ffffff 72%)` }}
              >
                <Image
                  src={p.url}
                  alt={p.name}
                  fill
                  sizes="(max-width:768px) 50vw, 220px"
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                />
                {p.video && (
                  <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur">
                    <Play size={14} className="fill-white text-white" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-3">
                  <span className="text-xs font-medium text-white/90">{p.user}</span>
                  <div className="flex items-center gap-2 text-white">
                    <button onClick={() => setLiked((s) => ({ ...s, [i]: !s[i] }))} className="flex items-center gap-1 text-xs">
                      <Heart size={14} className={liked[i] ? "fill-brand-red text-brand-red" : "text-white/80"} />
                      {(p.likes + (liked[i] ? 1 : 0)).toLocaleString("en-IN")}
                    </button>
                    <Share2 size={14} className="text-white/70 hover:text-white" />
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
