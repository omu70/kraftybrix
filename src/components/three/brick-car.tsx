"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural brick-built supercar — no external GLB required.
 * The body is assembled from rounded box "bricks"; the top faces are
 * decorated with cylindrical studs via an InstancedMesh for performance.
 */

type Brick = {
  pos: [number, number, number];
  size: [number, number, number];
  color?: string; // overrides body colour
};

const STUD_R = 0.11;
const STUD_H = 0.08;
const UNIT = 0.5; // stud grid spacing

export function BrickCar({
  bodyColor = "#FF2D20",
  accentColor = "#111111",
  exploded = 0,
}: {
  bodyColor?: string;
  accentColor?: string;
  /** 0 = assembled, 1 = fully exploded view */
  exploded?: number;
}) {
  const group = useRef<THREE.Group>(null);

  // Brick layout (units roughly 1 = 1 stud). Designed as a low wedge supercar.
  const bricks = useMemo<Brick[]>(
    () => [
      // ── floor / chassis
      { pos: [0, 0.25, 0], size: [3.2, 0.5, 7.4], color: accentColor },
      // ── lower body sides
      { pos: [0, 0.7, 0], size: [3.6, 0.5, 7.0] },
      // ── front wedge (nose) – stepped down
      { pos: [0, 0.95, 2.7], size: [3.2, 0.4, 1.8] },
      { pos: [0, 0.78, 3.5], size: [2.8, 0.35, 0.8] },
      // ── rear deck
      { pos: [0, 1.05, -2.7], size: [3.3, 0.5, 1.8] },
      { pos: [0, 0.9, -3.5], size: [3.0, 0.5, 0.7], color: accentColor }, // diffuser
      // ── cabin / greenhouse
      { pos: [0, 1.5, 0.1], size: [2.7, 0.7, 2.7], color: "#0b0b0b" }, // glass mass
      { pos: [0, 1.55, 0.1], size: [2.9, 0.1, 2.9] }, // roof rim
      // ── A/B pillars (accent)
      { pos: [1.45, 1.45, 0.1], size: [0.18, 0.7, 2.6], color: accentColor },
      { pos: [-1.45, 1.45, 0.1], size: [0.18, 0.7, 2.6], color: accentColor },
      // ── side skirts
      { pos: [1.85, 0.55, 0], size: [0.2, 0.4, 5.4], color: accentColor },
      { pos: [-1.85, 0.55, 0], size: [0.2, 0.4, 5.4], color: accentColor },
      // ── rear wing
      { pos: [0, 1.85, -3.4], size: [3.4, 0.12, 0.7] },
      { pos: [1.3, 1.55, -3.3], size: [0.16, 0.5, 0.5], color: accentColor },
      { pos: [-1.3, 1.55, -3.3], size: [0.16, 0.5, 0.5], color: accentColor },
      // ── headlights
      { pos: [1.1, 0.95, 3.85], size: [0.6, 0.25, 0.15], color: "#dfe9ff" },
      { pos: [-1.1, 0.95, 3.85], size: [0.6, 0.25, 0.15], color: "#dfe9ff" },
      // ── tail lights
      { pos: [1.1, 1.15, -3.85], size: [0.7, 0.22, 0.12], color: "#ff2d20" },
      { pos: [-1.1, 1.15, -3.85], size: [0.7, 0.22, 0.12], color: "#ff2d20" },
    ],
    [accentColor]
  );

  const wheels: [number, number, number][] = [
    [1.7, 0.45, 2.3],
    [-1.7, 0.45, 2.3],
    [1.7, 0.45, -2.3],
    [-1.7, 0.45, -2.3],
  ];

  // Stud instances across top faces of the main body bricks
  const studMatrices = useMemo(() => {
    const list: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const topBricks = bricks.filter(
      (b) => b.color === undefined || b.color === bodyColor
    );
    for (const b of topBricks) {
      const [bx, by, bz] = b.pos;
      const [sx, , sz] = b.size;
      const top = by + b.size[1] / 2 + STUD_H / 2;
      const cols = Math.max(1, Math.floor(sx / UNIT));
      const rows = Math.max(1, Math.floor(sz / UNIT));
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = bx - sx / 2 + UNIT / 2 + i * UNIT;
          const z = bz - sz / 2 + UNIT / 2 + j * UNIT;
          dummy.position.set(x, top, z);
          dummy.updateMatrix();
          list.push(dummy.matrix.clone());
        }
      }
    }
    return list;
  }, [bricks, bodyColor]);

  const studRef = useRef<THREE.InstancedMesh>(null);
  useMemo(() => {
    if (!studRef.current) return;
    studMatrices.forEach((m, i) => studRef.current!.setMatrixAt(i, m));
    studRef.current.instanceMatrix.needsUpdate = true;
  }, [studMatrices]);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    // idle float + slow yaw
    group.current.position.y = Math.sin(t * 0.6) * 0.06;
    group.current.rotation.y += 0.0016;
  });

  const explode = (axisSign: number) => 1 + exploded * 0.9 * axisSign;

  return (
    <group ref={group} rotation={[0.08, -0.5, 0]} scale={0.62}>
      {/* Bricks */}
      {bricks.map((b, i) => (
        <mesh
          key={i}
          position={[
            b.pos[0] * explode(Math.sign(b.pos[0]) || 0.0001),
            b.pos[1] + exploded * (b.pos[1] - 0.7) * 0.8,
            b.pos[2] * explode(Math.sign(b.pos[2]) || 0.0001),
          ]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={b.size} />
          <meshStandardMaterial
            color={b.color ?? bodyColor}
            metalness={b.color === "#0b0b0b" ? 0.2 : 0.35}
            roughness={b.color === "#0b0b0b" ? 0.1 : 0.45}
            emissive={
              b.color === "#ff2d20"
                ? "#ff2d20"
                : b.color === "#dfe9ff"
                ? "#aaccff"
                : "#000000"
            }
            emissiveIntensity={b.color === "#ff2d20" || b.color === "#dfe9ff" ? 0.6 : 0}
          />
        </mesh>
      ))}

      {/* Studs */}
      <instancedMesh
        ref={studRef}
        args={[undefined, undefined, studMatrices.length]}
        castShadow
      >
        <cylinderGeometry args={[STUD_R, STUD_R, STUD_H, 12]} />
        <meshStandardMaterial color={bodyColor} metalness={0.3} roughness={0.5} />
      </instancedMesh>

      {/* Wheels */}
      {wheels.map((w, i) => (
        <group key={i} position={[w[0] * (1 + exploded * 0.6 * Math.sign(w[0])), w[1], w[2]]}>
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.62, 0.62, 0.5, 24]} />
            <meshStandardMaterial color="#0a0a0a" metalness={0.2} roughness={0.7} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[Math.sign(w[0]) * 0.26, 0, 0]}>
            <cylinderGeometry args={[0.32, 0.32, 0.06, 18]} />
            <meshStandardMaterial color={accentColor} metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
