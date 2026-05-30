"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SKIN = "#c98e5f";
const SKIN_DARK = "#b07a4b";
const HAIR = "#15110d";
const BEARD = "#1a1410";
const SHIRT = "#94a39a";
const SHIRT_DARK = "#7c8b82";
const FRAME = "#e9e9e6"; // frosted clear glasses
const LENS = "#cdd6d2";
const EYE_WHITE = "#f5f2ec";
const PUPIL = "#3a2a1c"; // brown eyes
const LIP = "#a86b56";
const ACCENT = "#ff4a24"; // brand vermilion, used for the halo ring

// Curly hair tufts for volume (deterministic).
const TUFTS: [number, number, number, number][] = [
  [-0.34, 0.46, 0.18, 0.2],
  [0.32, 0.48, 0.14, 0.22],
  [0.02, 0.62, 0.06, 0.24],
  [-0.12, 0.58, 0.3, 0.18],
  [0.2, 0.56, 0.28, 0.19],
  [-0.46, 0.34, -0.04, 0.18],
  [0.46, 0.36, -0.06, 0.18],
  [0.0, 0.5, -0.36, 0.2],
];

/*
  Stylized likeness of Aniket: thick curly black hair, frosted rectangular
  glasses, a short beard and mustache, medium-tan skin, and a sage collared
  shirt. Genuinely interactive: head and gaze follow the pointer, it blinks
  and breathes on idle, and it reacts to scroll. Frozen under reduced motion.
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

    const ty = x * 0.5;
    const tx = -y * 0.3;
    head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, ty, 5, delta);
    head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tx, 5, delta);
    rig.current.rotation.y = THREE.MathUtils.damp(rig.current.rotation.y, ty * 0.35, 4, delta);

    const px = x * 0.05;
    const py = y * 0.035;
    for (const pupil of [leftPupil.current, rightPupil.current]) {
      if (!pupil) continue;
      pupil.position.x = THREE.MathUtils.damp(pupil.position.x, px, 8, delta);
      pupil.position.y = THREE.MathUtils.damp(pupil.position.y, py, 8, delta);
    }

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
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </mesh>

      {/* Shoulders / shirt */}
      <mesh position={[0, -1.05, 0]} scale={[1.55, 0.92, 0.98]}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshStandardMaterial color={SHIRT} roughness={0.7} metalness={0.02} />
      </mesh>
      {/* Collar flaps */}
      <mesh position={[-0.2, -0.52, 0.2]} rotation={[0.3, 0.2, 0.6]}>
        <boxGeometry args={[0.36, 0.16, 0.05]} />
        <meshStandardMaterial color={SHIRT_DARK} roughness={0.7} />
      </mesh>
      <mesh position={[0.2, -0.52, 0.2]} rotation={[0.3, -0.2, -0.6]}>
        <boxGeometry args={[0.36, 0.16, 0.05]} />
        <meshStandardMaterial color={SHIRT_DARK} roughness={0.7} />
      </mesh>
      {/* Button placket + buttons */}
      <mesh position={[0, -0.95, 0.4]}>
        <boxGeometry args={[0.07, 0.7, 0.04]} />
        <meshStandardMaterial color={SHIRT_DARK} roughness={0.7} />
      </mesh>
      {[-0.74, -0.96, -1.18].map((yy) => (
        <mesh key={yy} position={[0, yy, 0.43]}>
          <sphereGeometry args={[0.025, 12, 12]} />
          <meshStandardMaterial color="#5f6b63" roughness={0.5} />
        </mesh>
      ))}

      {/* Neck */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.4, 32]} />
        <meshStandardMaterial color={SKIN_DARK} roughness={0.74} />
      </mesh>

      {/* Head group (tilts toward pointer) */}
      <group ref={head} position={[0, 0.46, 0]}>
        {/* Skull */}
        <mesh scale={[0.97, 1.0, 0.94]}>
          <sphereGeometry args={[0.7, 64, 64]} />
          <meshStandardMaterial color={SKIN} roughness={0.76} metalness={0} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.68, -0.02, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.76} />
        </mesh>
        <mesh position={[0.68, -0.02, 0]}>
          <sphereGeometry args={[0.12, 24, 24]} />
          <meshStandardMaterial color={SKIN} roughness={0.76} />
        </mesh>

        {/* Beard: lower-jaw cap + sideburns + mustache */}
        <mesh position={[0, 0, 0.02]} scale={[1.02, 1.0, 1.0]}>
          <sphereGeometry args={[0.73, 48, 48, 0, Math.PI * 2, Math.PI * 0.66, Math.PI * 0.34]} />
          <meshStandardMaterial color={BEARD} roughness={0.85} />
        </mesh>
        <mesh position={[-0.58, -0.06, 0.26]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.09, 0.4, 0.12]} />
          <meshStandardMaterial color={BEARD} roughness={0.85} />
        </mesh>
        <mesh position={[0.58, -0.06, 0.26]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.09, 0.4, 0.12]} />
          <meshStandardMaterial color={BEARD} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.17, 0.62]}>
          <boxGeometry args={[0.26, 0.05, 0.05]} />
          <meshStandardMaterial color={BEARD} roughness={0.85} />
        </mesh>

        {/* Curly hair: dome + tufts for volume */}
        <mesh position={[0, 0.08, -0.02]} scale={[1.06, 1.16, 1.08]}>
          <sphereGeometry args={[0.71, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
          <meshStandardMaterial color={HAIR} roughness={0.78} />
        </mesh>
        {TUFTS.map(([tx2, ty2, tz, r], i) => (
          <mesh key={i} position={[tx2, ty2, tz]}>
            <sphereGeometry args={[r, 20, 20]} />
            <meshStandardMaterial color={HAIR} roughness={0.8} />
          </mesh>
        ))}

        {/* Thick eyebrows */}
        <mesh position={[-0.24, 0.24, 0.58]} rotation={[0, 0, 0.06]}>
          <boxGeometry args={[0.22, 0.05, 0.06]} />
          <meshStandardMaterial color={HAIR} roughness={0.8} />
        </mesh>
        <mesh position={[0.24, 0.24, 0.58]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[0.22, 0.05, 0.06]} />
          <meshStandardMaterial color={HAIR} roughness={0.8} />
        </mesh>

        {/* Eyes */}
        <group ref={leftEye} position={[-0.24, 0.05, 0.54]}>
          <mesh scale={[1, 0.86, 0.7]}>
            <sphereGeometry args={[0.135, 32, 32]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.3} />
          </mesh>
          <mesh ref={leftPupil} position={[0, 0, 0.09]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial color={PUPIL} roughness={0.25} />
            <mesh position={[-0.022, 0.028, 0.05]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </mesh>
        </group>
        <group ref={rightEye} position={[0.24, 0.05, 0.54]}>
          <mesh scale={[1, 0.86, 0.7]}>
            <sphereGeometry args={[0.135, 32, 32]} />
            <meshStandardMaterial color={EYE_WHITE} roughness={0.3} />
          </mesh>
          <mesh ref={rightPupil} position={[0, 0, 0.09]}>
            <sphereGeometry args={[0.07, 24, 24]} />
            <meshStandardMaterial color={PUPIL} roughness={0.25} />
            <mesh position={[-0.022, 0.028, 0.05]}>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </mesh>
        </group>

        {/* Frosted rectangular glasses: frames, lenses, bridge, arms */}
        <mesh position={[-0.24, 0.05, 0.62]}>
          <boxGeometry args={[0.36, 0.28, 0.03]} />
          <meshStandardMaterial color={FRAME} roughness={0.35} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.24, 0.05, 0.62]}>
          <boxGeometry args={[0.36, 0.28, 0.03]} />
          <meshStandardMaterial color={FRAME} roughness={0.35} transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.24, 0.05, 0.635]}>
          <boxGeometry args={[0.31, 0.23, 0.02]} />
          <meshStandardMaterial color={LENS} roughness={0.1} transparent opacity={0.25} />
        </mesh>
        <mesh position={[0.24, 0.05, 0.635]}>
          <boxGeometry args={[0.31, 0.23, 0.02]} />
          <meshStandardMaterial color={LENS} roughness={0.1} transparent opacity={0.25} />
        </mesh>
        <mesh position={[0, 0.08, 0.63]}>
          <boxGeometry args={[0.14, 0.04, 0.03]} />
          <meshStandardMaterial color={FRAME} roughness={0.35} transparent opacity={0.6} />
        </mesh>
        <mesh position={[-0.52, 0.07, 0.42]} rotation={[0, 0.7, 0]}>
          <boxGeometry args={[0.34, 0.03, 0.03]} />
          <meshStandardMaterial color={FRAME} roughness={0.35} transparent opacity={0.6} />
        </mesh>
        <mesh position={[0.52, 0.07, 0.42]} rotation={[0, -0.7, 0]}>
          <boxGeometry args={[0.34, 0.03, 0.03]} />
          <meshStandardMaterial color={FRAME} roughness={0.35} transparent opacity={0.6} />
        </mesh>

        {/* Nose */}
        <mesh position={[0, -0.08, 0.66]} scale={[0.75, 1.05, 0.85]}>
          <sphereGeometry args={[0.085, 24, 24]} />
          <meshStandardMaterial color={SKIN_DARK} roughness={0.76} />
        </mesh>

        {/* Mouth: subtle smile within the beard */}
        <mesh position={[0, -0.29, 0.6]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.11, 0.02, 16, 40, Math.PI]} />
          <meshStandardMaterial color={LIP} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
