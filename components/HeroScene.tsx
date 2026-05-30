"use client";

import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField";

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <ParticleField />
    </Canvas>
  );
}
