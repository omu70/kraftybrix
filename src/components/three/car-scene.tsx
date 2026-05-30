"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  AdaptiveDpr,
} from "@react-three/drei";
import * as THREE from "three";
import { BrickCar } from "./brick-car";

/** Floating ambient particles. */
function Particles({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 22;
        arr[i * 3 + 1] = Math.random() * 10 - 1;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
      return arr;
    })()
  );

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.45}
        sizeAttenuation
      />
    </points>
  );
}

/** Camera follows the pointer for a subtle parallax. */
function PointerCamera() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    target.current.x = state.pointer.x * 1.6;
    target.current.y = 2.4 + state.pointer.y * 0.8;
    camera.position.x += (target.current.x - camera.position.x) * 0.04;
    camera.position.y += (target.current.y - camera.position.y) * 0.04;
    camera.lookAt(0, 0.8, 0);
  });
  return null;
}

export function CarScene({
  bodyColor = "#FF2D20",
  accentColor = "#111111",
  className,
}: {
  bodyColor?: string;
  accentColor?: string;
  className?: string;
}) {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 2.4, 9], fov: 42 }}
    >
      <Suspense fallback={null}>
        <PointerCamera />
        <AdaptiveDpr pixelated />

        {/* Lighting rig */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[6, 9, 5]}
          intensity={2.4}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <spotLight position={[-8, 6, -4]} angle={0.5} intensity={3} color="#0066FF" />
        <spotLight position={[8, 4, 6]} angle={0.6} intensity={2.2} color="#FF2D20" />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <BrickCar bodyColor={bodyColor} accentColor={accentColor} />
        </Float>

        <Particles />

        <ContactShadows
          position={[0, -0.9, 0]}
          opacity={0.6}
          scale={16}
          blur={2.6}
          far={5}
          color="#000000"
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
