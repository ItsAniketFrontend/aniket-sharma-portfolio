"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { heroScroll } from "@/lib/scroll";

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const COUNT = 6000;
const RADIUS = 1.75;
const REPEL = 1.25; // cursor influence radius
const ACCENT = "#ff5a36";
const SOFT = "#ece8e1";

/*
  A point cloud shaped as a sphere. It rotates slowly, the cursor parts the
  particles around it, and the whole field explodes outward and fades as the
  hero scrolls away. Heavy work is a flat per-frame loop over a typed array.
  Cursor repulsion and rotation pause under reduced motion.
*/
export default function ParticleField() {
  const points = useRef<THREE.Points>(null);
  const angle = useRef(0);
  const { camera } = useThree();

  const { base, positions, colors } = useMemo(() => {
    const base = new Float32Array(COUNT * 3);
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const accent = new THREE.Color(ACCENT);
    const soft = new THREE.Color(SOFT);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT;
      const y = 1 - t * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      const ix = i * 3;
      base[ix] = x * RADIUS;
      base[ix + 1] = y * RADIUS;
      base[ix + 2] = z * RADIUS;
      positions[ix] = base[ix];
      positions[ix + 1] = base[ix + 1];
      positions[ix + 2] = base[ix + 2];
      const c = Math.random() < 0.32 ? accent : soft;
      colors[ix] = c.r;
      colors[ix + 1] = c.g;
      colors[ix + 2] = c.b;
    }
    return { base, positions, colors };
  }, []);

  // Soft round sprite so points glow instead of being squares.
  const sprite = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    const posAttr = points.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    if (!reducedMotion) angle.current += delta * 0.08;
    const ca = Math.cos(angle.current);
    const sa = Math.sin(angle.current);

    const p = reducedMotion ? 0 : heroScroll.progress;
    const explode = 1 + p * 0.7;

    const mx = state.pointer.x * 2.6;
    const my = state.pointer.y * 2.6;
    const mz = 2.0;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const bx = base[ix];
      const by = base[ix + 1];
      const bz = base[ix + 2];

      // rotate base around Y, then explode on scroll
      let tx = (bx * ca + bz * sa) * explode;
      let ty = by * explode;
      let tz = (-bx * sa + bz * ca) * explode;

      if (!reducedMotion) {
        const dx = tx - mx;
        const dy = ty - my;
        const dz = tz - mz;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < REPEL * REPEL) {
          const d = Math.sqrt(d2) || 0.0001;
          const f = 1 - d / REPEL;
          const push = f * f * 1.0;
          tx += (dx / d) * push;
          ty += (dy / d) * push;
          tz += (dz / d) * push;
        }
      }

      // ease toward target for fluid motion
      arr[ix] += (tx - arr[ix]) * 0.16;
      arr[ix + 1] += (ty - arr[ix + 1]) * 0.16;
      arr[ix + 2] += (tz - arr[ix + 2]) * 0.16;
    }
    posAttr.needsUpdate = true;

    const mat = points.current.material as THREE.PointsMaterial;
    mat.opacity = 0.92 * (1 - p * 0.85);

    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5 + p * 2, 3, delta);
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        map={sprite}
        alphaTest={0.01}
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
