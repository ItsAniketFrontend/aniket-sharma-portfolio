"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SKIN = "#eab991";
const SKIN_DARK = "#d99a6f";
const HAIR = "#2a2018";
const HOODIE = "#ff4a24";
const HOODIE_DARK = "#dd3d1c";
const CUP = "#26262d";
const FRAME = "#181820";
const EYE_WHITE = "#f5f2ec";
const PUPIL = "#241c18";
const LIP = "#bd6f5e";

/*
  A stylized young developer: bigger head and slim shoulders for a youthful
  read, clean symmetric eyes, a modern swept fringe, round glasses, a friendly
  smile, and over-ear headphones. Genuinely interactive: head and gaze follow
  the pointer, it blinks and breathes on idle, and it reacts to scroll. Frozen
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

    // Head leans toward the pointer; rig follows a little.
    const ty = x * 0.5;
    const tx = -y * 0.3;
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, ty, 5, delta);
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tx, 5, delta);
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, ty * 0.35, 4, delta);

    // Pupils track the pointer within the eyes.
    const px = x * 0.05;
    const py = y * 0.035;
    for (const pupil of [leftPupil.current, rightPupil.current]) {
      if (!pupil) continue;
      pupil.position.x = THREE.MathUtils.damp(pupil.position.x, px, 8, delta);
      pupil.position.y = THREE.MathUtils.damp(pupil.position.y, py, 8, delta);
    }

    // Idle breathing + blink.
    if (!reducedMotion) {
      const breathe = 1 + Math.sin(t * 1.4) * 0.012;
      rig.current.scale.setScalar(breathe * (1 - heroScroll.progress * 0.32));
      head.current.position.y = 0.46 + Math.sin(t * 1.4) * 0.01;

      const cyc = t % 4.4;
      let open = 1;
      if (cyc > 4.2) open = Math.abs(Math.cos(((cyc - 4.2) / 0.2) * Math.PI));
      const lid = 0.1 + 0.9 * open;
      if (leftEye.current) leftEye.current.scale.y = lid;
      if (rightEye.current) rightEye.current.scale.y = lid;
    } else {
      rig.current.scale.setScalar(1 - heroScroll.progress * 0.32);
    }

    // Scroll-linked: spin away, drift up, camera pulls back.
    const p = reducedMotion ? 0 : heroScroll.progress;
    rig.current.rotation.z = p * 0.4;
    rig.current.position.y = -0.15 + p * 0.9;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.2 + p * 3, 3, delta);
  });

  return (
    <group ref={rig} position={[0, -0.15, 0]}>
      {/* Halo ring, on-brand accent behind the bust */}
      <mesh position={[0, 0.35, -0.8]}>
        <torusGeometry args={[1.1, 0.016, 16, 80]} />
        <meshBasicMaterial color={HOODIE} transparent opacity={0.5} />
      </mesh>

      {/* Shoulders / hoodie (single slim form) */}
      <mesh position={[0, -1.05, 0]} scale={[1.5, 0.92, 0.98]}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshStandardMaterial color={HOODIE} roughness={0.55} metalness={0.04} />
      </mesh>
      {/* Hood behind the neck */}
      <mesh position={[0, -0.42, -0.24]} scale={[1, 0.8, 0.8]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial color={HOODIE_DARK} roughness={0.6} />
      </mesh>
      {/* Crew collar */}
      <mesh position={[0, -0.5, 0.04]} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[0.26, 0.07, 16, 40]} />
        <meshStandardMaterial color={HOODIE_DARK} roughness={0.6} />
      </mesh>
      {/* Drawstrings */}
      <mesh position={[-0.08, -0.82, 0.34]}>
        <cylinderGeometry args={[0.014, 0.014, 0.34, 12]} />
        <meshStandardMaterial color="#f0ece3" roughness={0.7} />
      </mesh>
      <mesh position={[0.08, -0.82, 0.34]}>
        <cylinderGeometry args={[0.014, 0.014, 0.3, 12]} />
        <meshStandardMaterial color="#f0ece3" roughness={0.7} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.4, 32]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.72} />
      </mesh>

      {/* Head group (tilts toward pointer) */}
      <group ref={head} position={[0, 0.46, 0]}>
        {/* Skull, rounder for a youthful read */}
        <mesh scale={[0.97, 1.0, 0.94]}>
          <sphereGeometry args={[0.7, 64, 64]} />
          <meshStandardMaterial color={SKIN} roughness={0.74} metalness={0} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.68, -0.02, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.74} />
        </mesh>
        <mesh position={[0.68, -0.02, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.74} />
        </mesh>

        {/* Hair: clean dome ending above the brows + a swept quiff */}
        <mesh position={[0, 0.06, -0.02]} scale={[1.04, 1.02, 1.06]}>
          <sphereGeometry args={[0.71, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.36]} />
          <meshStandardMaterial color={HAIR} roughness={0.65} />
        </mesh>
        <mesh position={[0.06, 0.42, 0.26]} rotation={[0.6, 0, -0.12]} scale={[1.05, 0.6, 0.7]}>
          <sphereGeometry args={[0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
          <meshStandardMaterial color={HAIR} roughness={0.65} />
        </mesh>

        {/* Eyebrows (above the glasses) */}
        <mesh position={[-0.24, 0.22, 0.58]} rotation={[0, 0, 0.04]}>
          <boxGeometry args={[0.2, 0.04, 0.05]} />
          <meshStandardMaterial color={HAIR} roughness={0.65} />
        </mesh>
        <mesh position={[0.24, 0.22, 0.58]} rotation={[0, 0, -0.04]}>
          <boxGeometry args={[0.2, 0.04, 0.05]} />
          <meshStandardMaterial color={HAIR} roughness={0.65} />
        </mesh>

        {/* Eyes (bigger and symmetric; blink by scaling y) */}
        <group ref={leftEye} position={[-0.24, 0.05, 0.54]}>
          <mesh scale={[1, 0.86, 0.7]}>
            <sphereGeometry args={[0.14, 32, 32]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.3} />
          </mesh>
          <mesh ref={leftPupil} position={[0, 0, 0.09]}>
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshStandardMaterial color={PUPIL} roughness={0.2} />
            <mesh position={[-0.025, 0.03, 0.05]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </mesh>
        </group>
        <group ref={rightEye} position={[0.24, 0.05, 0.54]}>
          <mesh scale={[1, 0.86, 0.7]}>
            <sphereGeometry args={[0.14, 32, 32]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.3} />
          </mesh>
          <mesh ref={rightPupil} position={[0, 0, 0.09]}>
            <sphereGeometry args={[0.075, 24, 24]} />
            <meshStandardMaterial color={PUPIL} roughness={0.2} />
            <mesh position={[-0.025, 0.03, 0.05]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </mesh>
        </group>

        {/* Round glasses: thin frames, bridge, temple arms */}
        <mesh position={[-0.24, 0.05, 0.64]}>
          <torusGeometry args={[0.17, 0.014, 16, 40]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0.24, 0.05, 0.64]}>
          <torusGeometry args={[0.17, 0.014, 16, 40]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0, 0.05, 0.64]}>
          <boxGeometry args={[0.14, 0.016, 0.016]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[-0.52, 0.07, 0.4]} rotation={[0, 0.7, 0]}>
          <boxGeometry args={[0.34, 0.016, 0.016]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.5} />
        </mesh>
        <mesh position={[0.52, 0.07, 0.4]} rotation={[0, -0.7, 0]}>
          <boxGeometry args={[0.34, 0.016, 0.016]} />
          <meshStandardMaterial color={FRAME} roughness={0.3} metalness={0.5} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.08, 0.66]} scale={[0.7, 1, 0.8]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.74} />
        </mesh>

        {/* Friendly smile (lower half of a torus) */}
        <mesh position={[0, -0.3, 0.6]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.14, 0.022, 16, 40, Math.PI]} />
          <meshStandardMaterial color={LIP} roughness={0.6} />
        </mesh>

        {/* Over-ear headphones: band + cups + accent rings */}
        <mesh position={[0, 0.06, -0.02]} rotation={[-0.06, 0, 0]}>
          <torusGeometry args={[0.84, 0.05, 16, 48, Math.PI]} />
          <meshStandardMaterial color={CUP} roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[-0.76, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.14, 32]} />
          <meshStandardMaterial color={CUP} roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0.76, -0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.18, 0.18, 0.14, 32]} />
          <meshStandardMaterial color={CUP} roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[-0.85, -0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.1, 0.022, 16, 32]} />
          <meshStandardMaterial color={HOODIE} roughness={0.4} />
        </mesh>
        <mesh position={[0.85, -0.02, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.1, 0.022, 16, 32]} />
          <meshStandardMaterial color={HOODIE} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
