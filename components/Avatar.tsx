"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SKIN = "#e8b48f";
const SKIN_DARK = "#d99a72";
const HAIR = "#1b1b20";
const HOODIE = "#ff4a24";
const DARK = "#202026";
const EYE_WHITE = "#f4f1ea";

/*
  A stylized 3D avatar built from primitives. It is genuinely interactive:
  the head and gaze follow the pointer, it blinks and breathes on idle, and
  it reacts to scroll (spins back, shrinks, the camera dollies out). Frozen
  under reduced motion.
*/
export default function Avatar() {
  const rig = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const leftPupil = useRef<THREE.Mesh>(null);
  const rightPupil = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!rig.current || !head.current) return;
    const { x, y } = state.pointer;
    const t = state.clock.elapsedTime;

    // Head and rig lean toward the pointer.
    const targetY = x * 0.55;
    const targetX = -y * 0.32;
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, targetY, 5, delta);
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, targetX, 5, delta);
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, targetY * 0.4, 4, delta);

    // Pupils track the pointer within the eyes.
    const px = x * 0.045;
    const py = y * 0.03;
    if (leftPupil.current) {
      leftPupil.current.position.x = THREE.MathUtils.damp(leftPupil.current.position.x, px, 8, delta);
      leftPupil.current.position.y = THREE.MathUtils.damp(leftPupil.current.position.y, py, 8, delta);
    }
    if (rightPupil.current) {
      rightPupil.current.position.x = THREE.MathUtils.damp(rightPupil.current.position.x, px, 8, delta);
      rightPupil.current.position.y = THREE.MathUtils.damp(rightPupil.current.position.y, py, 8, delta);
    }

    // Idle breathing + blink.
    if (!reducedMotion) {
      const breathe = 1 + Math.sin(t * 1.4) * 0.012;
      rig.current.scale.setScalar(breathe * (1 - heroScroll.progress * 0.32));
      head.current.position.y = 0.15 + Math.sin(t * 1.4) * 0.01;

      const cyc = t % 4.2;
      let open = 1;
      if (cyc > 4.0) open = Math.abs(Math.cos(((cyc - 4.0) / 0.2) * Math.PI));
      const lid = 0.12 + 0.88 * open;
      if (leftEye.current) leftEye.current.scale.y = lid;
      if (rightEye.current) rightEye.current.scale.y = lid;
    } else {
      rig.current.scale.setScalar(1 - heroScroll.progress * 0.32);
    }

    // Scroll-linked: spin away, drift up, camera pulls back.
    const p = reducedMotion ? 0 : heroScroll.progress;
    rig.current.rotation.z = p * 0.4;
    rig.current.position.y = -0.1 + p * 0.9;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.2 + p * 3, 3, delta);
  });

  return (
    <group ref={rig} position={[0, -0.1, 0]}>
      {/* Halo ring, on-brand accent behind the bust */}
      <mesh position={[0, 0.2, -0.7]}>
        <torusGeometry args={[1.05, 0.018, 16, 80]} />
        <meshBasicMaterial color={HOODIE} transparent opacity={0.55} />
      </mesh>

      {/* Hoodie / shoulders */}
      <mesh position={[0, -1.25, 0]}>
        <sphereGeometry args={[1.05, 48, 48]} />
        <meshStandardMaterial color={HOODIE} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, -1.25, 0]} scale={[1.16, 0.78, 0.96]}>
        <sphereGeometry args={[1.05, 48, 48]} />
        <meshStandardMaterial color={HOODIE} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* Hoodie collar */}
      <mesh position={[0, -0.62, 0.05]} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[0.3, 0.1, 16, 40]} />
        <meshStandardMaterial color={"#e2421f"} roughness={0.6} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.21, 0.25, 0.5, 32]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.7} />
      </mesh>

      {/* Head group (tilts toward pointer) */}
      <group ref={head} position={[0, 0.15, 0]}>
        {/* Skull */}
        <mesh scale={[0.97, 1.06, 0.94]}>
          <sphereGeometry args={[0.62, 64, 64]} />
          <meshStandardMaterial color={SKIN} roughness={0.72} metalness={0} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.6, 0.0, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.72} />
        </mesh>
        <mesh position={[0.6, 0.0, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.72} />
        </mesh>

        {/* Hair: dome over the top + back */}
        <mesh position={[0, 0.08, -0.03]} rotation={[-0.12, 0, 0]} scale={[1.02, 1.0, 1.04]}>
          <sphereGeometry args={[0.64, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>
        {/* Fringe */}
        <mesh position={[0, 0.46, 0.34]} rotation={[0.5, 0, 0]} scale={[0.9, 0.5, 0.4]}>
          <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>

        {/* Eyebrows */}
        <mesh position={[-0.21, 0.34, 0.5]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.18, 0.035, 0.05]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>
        <mesh position={[0.21, 0.34, 0.5]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.18, 0.035, 0.05]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>

        {/* Eyes (blink by scaling y) */}
        <group ref={leftEye} position={[-0.21, 0.2, 0.46]}>
          <mesh scale={[1, 0.82, 0.7]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.35} />
          </mesh>
          <mesh ref={leftPupil} position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.055, 24, 24]} />
            <meshStandardMaterial color={DARK} roughness={0.2} />
          </mesh>
        </group>
        <group ref={rightEye} position={[0.21, 0.2, 0.46]}>
          <mesh scale={[1, 0.82, 0.7]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.35} />
          </mesh>
          <mesh ref={rightPupil} position={[0, 0, 0.08]}>
            <sphereGeometry args={[0.055, 24, 24]} />
            <meshStandardMaterial color={DARK} roughness={0.2} />
          </mesh>
        </group>

        {/* Glasses: frames + bridge, developer touch */}
        <mesh position={[-0.21, 0.2, 0.55]}>
          <torusGeometry args={[0.16, 0.022, 16, 40]} />
          <meshStandardMaterial color={DARK} roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0.21, 0.2, 0.55]}>
          <torusGeometry args={[0.16, 0.022, 16, 40]} />
          <meshStandardMaterial color={DARK} roughness={0.3} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.2, 0.56]}>
          <boxGeometry args={[0.12, 0.022, 0.022]} />
          <meshStandardMaterial color={DARK} roughness={0.3} metalness={0.4} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0.09, 0.58]} scale={[0.7, 1, 0.8]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.72} />
        </mesh>

        {/* Mouth: subtle smile */}
        <mesh position={[0, -0.13, 0.54]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.2, 0.03, 0.04]} />
          <meshStandardMaterial color={"#9c5a4a"} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
