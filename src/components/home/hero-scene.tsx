"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Cinematic hero background — a field of floating "brick" blocks lit dramatically
 * in darkness. On-brand (bricks), model-free, GPU-light. Reacts to the cursor for
 * a sense of depth/parallax. Rendered client-only (dynamic import, ssr:false).
 */

const COLORS = ["#FF2D20", "#F5A623", "#0066FF", "#ffffff", "#E8662A"];

function Bricks() {
  const group = useRef<THREE.Group>(null);
  const bricks = useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        pos: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 7] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI] as [number, number, number],
        scale: 0.28 + Math.random() * 0.55,
        color: COLORS[i % COLORS.length],
        speed: 0.2 + Math.random() * 0.5,
      })),
    []
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    g.rotation.y += delta * 0.04;
    // gentle cursor parallax
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.18, 0.04);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.1, 0.04);
    g.children.forEach((c, i) => {
      c.position.y += Math.sin(state.clock.elapsedTime * bricks[i].speed + i) * delta * 0.12;
      c.rotation.x += delta * 0.08 * bricks[i].speed;
    });
  });

  return (
    <group ref={group}>
      {bricks.map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot} scale={b.scale}>
          <boxGeometry args={[1, 0.62, 1]} />
          <meshStandardMaterial color={b.color} emissive={b.color} emissiveIntensity={0.12} roughness={0.4} metalness={0.15} />
        </mesh>
      ))}
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 46 }} dpr={[1, 1.8]} gl={{ antialias: true, alpha: true }}>
      <fog attach="fog" args={["#0d0b09", 9, 22]} />
      <ambientLight intensity={0.7} />
      <spotLight position={[9, 9, 9]} angle={0.5} penumbra={0.6} intensity={70} color="#ffffff" />
      <pointLight position={[-8, -4, 5]} intensity={45} color="#FF2D20" />
      <pointLight position={[7, -6, 3]} intensity={28} color="#F5A623" />
      <Bricks />
    </Canvas>
  );
}
