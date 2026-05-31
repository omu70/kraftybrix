"use client";

import { useRef, useLayoutEffect } from "react";
import { Package, Wrench, Trophy } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  { n: "01", icon: Package, title: "Unbox", body: "Lift the lid on a premium, magnetically-sealed box. Sorted bays, numbered bags, a hardbound manual. The ritual begins." },
  { n: "02", icon: Wrench, title: "Build", body: "Hours of flow-state assembly. Working mechanisms click into place. Every stage is a small, satisfying victory." },
  { n: "03", icon: Trophy, title: "Display", body: "Mount your finished machine on its rotating plinth. Hit the light kit. Step back. This is yours." },
];

export function BuildExperience() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".be-step", {
        y: 60,
        opacity: 0,
        stagger: 0.18,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.fromTo(
        ".be-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left",
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 60%" },
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="build" ref={root} className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-radial-spot opacity-40" />
      <div className="container-wide relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center"><span className="h-px w-8 bg-brand-red" /> The experience</p>
          <h2 className="h-display mt-3 text-4xl sm:text-5xl">Three steps to your dream build</h2>
        </div>

        <div className="relative mt-20">
          <div className="be-line absolute left-0 top-12 hidden h-px w-full bg-gradient-to-r from-brand-red via-brand-blue to-transparent lg:block" />
          <div className="grid gap-10 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="be-step relative">
                <div className="relative z-10 grid h-24 w-24 place-items-center rounded-2xl border border-black/10 bg-ink-800">
                  <s.icon size={34} className="text-brand-red" />
                  <span className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full bg-brand-red font-display text-sm font-bold">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-7 font-display text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 max-w-xs text-black/55">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
