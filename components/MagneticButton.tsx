"use client";

import { useRef } from "react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
};

/*
  Magnetic pull on hover. Motion is motivated: it signals the primary action
  and rewards intent. Transforms only, and it no-ops under reduced motion.
*/
export default function MagneticButton({
  href,
  children,
  variant = "solid",
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: React.MouseEvent) {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    ref.current.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  }

  function onLeave() {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0, 0)";
  }

  const base =
    "group relative inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-7 py-3.5 text-sm font-medium transition-[transform,background-color,color] duration-300 will-change-transform";
  const styles =
    variant === "solid"
      ? "bg-flame text-ink hover:bg-flame-soft shadow-[0_8px_30px_-12px_rgba(255,74,36,0.6)]"
      : "text-bone hairline hover:border-flame hover:text-flame";

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`${base} ${styles} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
    </a>
  );
}
