"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
  The brand object. A faceted core in vermilion that slowly breathes and
  follows the pointer, wrapped in a hairline cage for depth. Motion is
  motivated: it reacts to the visitor and reinforces the accent. It freezes
  under reduced motion.
*/
function BrandObject() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    const targetY = x * 0.6 + (reducedMotion ? 0 : state.clock.elapsedTime * 0.12);
    const targetX = -y * 0.45;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      4,
      delta
    );
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      4,
      delta
    );

    // Scroll-driven: spin and shrink as the hero scrolls away.
    const p = reducedMotion ? 0 : heroScroll.progress;
    group.current.rotation.z = p * Math.PI * 0.5;
    const s = 1 - p * 0.35;
    group.current.scale.set(s, s, s);
    group.current.position.y = p * 0.8;

    // Camera dollies back as the hero scrolls away.
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.2 + p * 3, 3, delta);
  });

  return (
    <group ref={group}>
      {/* Faceted, gently distorting core */}
      <Icosahedron ref={core} args={[1.45, 8]}>
        <MeshDistortMaterial
          color="#ff4a24"
          distort={reducedMotion ? 0 : 0.32}
          speed={reducedMotion ? 0 : 1.4}
          roughness={0.28}
          metalness={0.45}
        />
      </Icosahedron>

      {/* Hairline cage, on-brand line color */}
      <Icosahedron args={[2.15, 1]}>
        <meshBasicMaterial color="#3a3a42" wireframe transparent opacity={0.5} />
      </Icosahedron>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      {/* Manual lighting, no external HDR fetch. No neon glow. */}
      <ambientLight intensity={0.45} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <directionalLight position={[-6, -3, -4]} intensity={0.6} color="#ff6a4a" />
      <pointLight position={[0, 0, 4]} intensity={12} color="#ffffff" distance={12} />

      {reducedMotion ? (
        <BrandObject />
      ) : (
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.7}>
          <BrandObject />
        </Float>
      )}
    </Canvas>
  );
}
