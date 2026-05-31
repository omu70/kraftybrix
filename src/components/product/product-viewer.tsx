"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Stage } from "@react-three/drei";
import { RotateCcw, Maximize2, Layers, Move3d } from "lucide-react";
import { BrickCar } from "@/components/three/brick-car";
import { cn } from "@/lib/utils";

export function ProductViewer({
  bodyColor,
  accentColor,
}: {
  bodyColor: string;
  accentColor: string;
}) {
  const [exploded, setExploded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-white/10 bg-ink-800",
        fullscreen ? "fixed inset-4 z-[80]" : "aspect-square w-full"
      )}
      style={{ background: `radial-gradient(120% 100% at 30% 10%, ${bodyColor}1f, #ffffff 72%)` }}
    >
      <Canvas
        key={resetKey}
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [5, 3, 6], fov: 40 }}
      >
        <Suspense fallback={null}>
          <Stage intensity={0.4} environment="city" shadows={false} adjustCamera={false}>
            <BrickCar bodyColor={bodyColor} accentColor={accentColor} exploded={exploded ? 1 : 0} />
          </Stage>
          <ContactShadows position={[0, -1.2, 0]} opacity={0.5} scale={14} blur={2.5} />
          <Environment preset="city" />
          <OrbitControls
            enablePan={false}
            minDistance={4}
            maxDistance={11}
            autoRotate={!exploded}
            autoRotateSpeed={0.8}
          />
        </Suspense>
      </Canvas>

      {/* controls */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-ink-900/80 p-1.5 backdrop-blur">
        <ViewerBtn active={exploded} onClick={() => setExploded((v) => !v)} icon={Layers} label="Exploded" />
        <ViewerBtn onClick={() => setResetKey((k) => k + 1)} icon={RotateCcw} label="Reset" />
        <ViewerBtn onClick={() => setFullscreen((v) => !v)} icon={Maximize2} label="Fullscreen" />
      </div>

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 text-xs text-white/40">
        <Move3d size={14} /> Drag to rotate
      </div>

      {fullscreen && (
        <button
          onClick={() => setFullscreen(false)}
          className="absolute right-4 top-4 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur"
        >
          Close
        </button>
      )}
    </div>
  );
}

function ViewerBtn({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: typeof Layers;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium transition",
        active ? "bg-brand-red text-white" : "text-white/70 hover:bg-white/10 hover:text-cream"
      )}
    >
      <Icon size={15} /> {label}
    </button>
  );
}
