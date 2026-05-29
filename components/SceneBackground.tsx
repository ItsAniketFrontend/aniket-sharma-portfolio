"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { pageScroll } from "@/lib/scroll";

const reduced =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Shape = {
  p: [number, number, number];
  s: number;
  t: "ico" | "oct" | "tet" | "dod";
  accent?: boolean;
};

// Deterministic field so positions are stable across reloads.
const SHAPES: Shape[] = [
  { p: [-6, 4, -3], s: 0.9, t: "ico" },
  { p: [5.5, 3, -2], s: 0.6, t: "tet", accent: true },
  { p: [-4.5, -2, -1], s: 0.5, t: "oct" },
  { p: [6, -3.5, -4], s: 1.1, t: "dod" },
  { p: [-6.5, -6, -2], s: 0.7, t: "ico", accent: true },
  { p: [4, 6, -5], s: 0.8, t: "oct" },
  { p: [0, -5, -6], s: 1.3, t: "ico" },
  { p: [-2.5, 7, -3], s: 0.45, t: "tet" },
  { p: [7, 0.5, -3], s: 0.55, t: "oct" },
  { p: [-7, 1, -5], s: 0.95, t: "dod" },
  { p: [2.5, -7, -2], s: 0.6, t: "tet", accent: true },
  { p: [3, 2, -1], s: 0.4, t: "ico" },
  { p: [-3.5, -8.5, -4], s: 0.85, t: "oct" },
  { p: [5, -1, -6], s: 0.7, t: "dod" },
  { p: [-5.5, 8, -5], s: 0.65, t: "ico" },
  { p: [1.5, 9, -4], s: 0.5, t: "tet" },
];

function geometry(t: Shape["t"]) {
  switch (t) {
    case "oct":
      return <octahedronGeometry args={[1, 0]} />;
    case "tet":
      return <tetrahedronGeometry args={[1, 0]} />;
    case "dod":
      return <dodecahedronGeometry args={[1, 0]} />;
    default:
      return <icosahedronGeometry args={[1, 0]} />;
  }
}

function Field() {
  const g = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (!g.current) return;
    if (!reduced) {
      g.current.rotation.y += dt * 0.025;
      const kids = g.current.children;
      for (let i = 0; i < kids.length; i++) {
        kids[i].rotation.x += dt * 0.12 * (((i % 3) + 1) * 0.3);
        kids[i].rotation.z += dt * 0.05;
      }
    }
    // Whole field drifts up as you scroll the page. Parallax depth.
    g.current.position.y = THREE.MathUtils.damp(
      g.current.position.y,
      pageScroll.progress * 7 - 1.5,
      2.5,
      dt
    );
  });

  return (
    <group ref={g}>
      {SHAPES.map((sh, i) => (
        <mesh key={i} position={sh.p} scale={sh.s}>
          {geometry(sh.t)}
          <meshBasicMaterial
            color={sh.accent ? "#ff4a24" : "#46464f"}
            wireframe
            transparent
            opacity={sh.accent ? 0.4 : 0.22}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function SceneBackground() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 50 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Field />
    </Canvas>
  );
}
