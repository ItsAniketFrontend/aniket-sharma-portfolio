"use client";

import { Canvas } from "@react-three/fiber";
import Avatar from "./Avatar";

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      {/* Manual lighting tuned for stylized skin. No external HDR fetch. */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <directionalLight position={[-5, -2, -3]} intensity={0.5} color="#ff6a4a" />
      <pointLight position={[2, 1.5, 4]} intensity={14} color="#ffffff" distance={16} />
      <Avatar />
    </Canvas>
  );
}
