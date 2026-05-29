"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
};

/*
  Pointer-driven 3D tilt. The card rotates toward the cursor on a real
  perspective, so flat panels read as physical objects. Disabled under
  reduced motion. Transforms only, smoothed with gsap.quickTo.
*/
export default function Tilt({
  children,
  className = "",
  max = 7,
  glare = true,
}: Props) {
  const el = useRef<HTMLDivElement>(null);
  const rotX = useRef<((v: number) => void) | null>(null);
  const rotY = useRef<((v: number) => void) | null>(null);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useGSAP(
    () => {
      if (!el.current || reduced) return;
      gsap.set(el.current, { transformPerspective: 800, transformStyle: "preserve-3d" });
      rotX.current = gsap.quickTo(el.current, "rotationX", { duration: 0.5, ease: "power3" });
      rotY.current = gsap.quickTo(el.current, "rotationY", { duration: 0.5, ease: "power3" });
    },
    { scope: el }
  );

  function onMove(e: React.MouseEvent) {
    if (reduced || !el.current) return;
    const r = el.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotY.current?.(px * max * 2);
    rotX.current?.(-py * max * 2);
    if (glare) {
      el.current.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      el.current.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    }
  }

  function onLeave() {
    rotX.current?.(0);
    rotY.current?.(0);
  }

  return (
    <div
      ref={el}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative will-change-transform ${className}`}
      style={
        glare
          ? ({
              ["--mx" as string]: "50%",
              ["--my" as string]: "50%",
            } as React.CSSProperties)
          : undefined
      }
    >
      {children}
      {glare && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [background:radial-gradient(circle_at_var(--mx)_var(--my),rgba(255,74,36,0.14),transparent_45%)] group-hover:opacity-100"
        />
      )}
    </div>
  );
}
