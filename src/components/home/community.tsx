"use client";

import { useState } from "react";
import { Heart, Play, Share2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { BrickCarArt } from "@/components/brand/brick-car-art";

const posts = [
  { user: "@apex_collector", likes: 1284, color: "#FF2D20", video: false },
  { user: "@jdm_garage_in", likes: 2031, color: "#0066FF", video: true },
  { user: "@brickspeed", likes: 877, color: "#E8E8E8", video: false },
  { user: "@shelf.icons", likes: 1540, color: "#7a00ff", video: false },
  { user: "@nocturne.build", likes: 3110, color: "#141414", video: true },
  { user: "@summit.overland", likes: 642, color: "#1f6f3f", video: false },
];

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
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-black/10"
                style={{ background: `radial-gradient(120% 100% at 50% 0%, ${p.color}33, #ffffff 72%)` }}
              >
                <BrickCarArt color={p.color} shadow={false} className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-110" />
                {p.video && (
                  <div className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/50 backdrop-blur">
                    <Play size={14} className="fill-white" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-3">
                  <span className="text-xs font-medium text-black/80">{p.user}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setLiked((s) => ({ ...s, [i]: !s[i] }))} className="flex items-center gap-1 text-xs">
                      <Heart size={14} className={liked[i] ? "fill-brand-red text-brand-red" : "text-black/70"} />
                      {(p.likes + (liked[i] ? 1 : 0)).toLocaleString("en-IN")}
                    </button>
                    <Share2 size={14} className="text-black/60 hover:text-zinc-900" />
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
