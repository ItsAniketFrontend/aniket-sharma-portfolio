"use client";

import { useRef, useState } from "react";

type Project = {
  name: string;
  category: string;
  year: string;
  stack: string;
  seed: string;
};

const projects: Project[] = [
  {
    name: "Tend",
    category: "Mobile app for plant care reminders",
    year: "2025",
    stack: "React Native, Expo, Supabase",
    seed: "tend-plant-app",
  },
  {
    name: "Harbor",
    category: "Logistics dashboard for a freight startup",
    year: "2024",
    stack: "Next.js, PostgreSQL, Mapbox",
    seed: "harbor-logistics",
  },
  {
    name: "Cadence",
    category: "Web app for remote music collaboration",
    year: "2024",
    stack: "React, WebRTC, Node.js",
    seed: "cadence-music-studio",
  },
  {
    name: "Folio",
    category: "Headless storefront for an apparel label",
    year: "2023",
    stack: "Next.js, Shopify, Stripe",
    seed: "folio-storefront",
  },
];

export default function Work() {
  const [active, setActive] = useState<number | null>(null);
  const pos = useRef({ x: 0, y: 0 });
  const previewRef = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent) {
    pos.current = { x: e.clientX, y: e.clientY };
    if (previewRef.current) {
      previewRef.current.style.transform = `translate(${e.clientX + 24}px, ${
        e.clientY - 130
      }px)`;
    }
  }

  return (
    <section
      id="work"
      onMouseMove={onMove}
      className="relative px-4 py-28 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-14 flex items-end justify-between gap-6">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
              Selected work
            </span>
            <h2 className="flip-up mt-4 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold">
              Things I have built
            </h2>
          </div>
          <p className="hidden max-w-xs text-sm text-muted md:block">
            A few projects from the last couple of years. Each one shipped and
            in the hands of real users.
          </p>
        </div>

        <ul className="border-t border-line">
          {projects.map((p, i) => (
            <li key={p.name}>
              <a
                href="#contact"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="reveal-3d group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-line py-7 transition-colors duration-300 hover:bg-surface/30 md:py-9"
              >
                <span className="font-display text-sm text-muted tabular-nums">
                  {p.year}
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-bold transition-colors duration-300 group-hover:text-flame md:text-4xl">
                    {p.name}
                  </h3>
                  <p className="mt-1 truncate text-sm text-muted">
                    {p.category}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="hidden text-right text-xs text-bone-dim lg:block">
                    {p.stack}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full hairline text-bone transition-all duration-300 group-hover:border-flame group-hover:bg-flame group-hover:text-ink">
                    ↗
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Cursor-following preview. Motivated: previews the work without leaving the list. */}
      <div
        ref={previewRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden h-64 w-80 overflow-hidden rounded-[var(--radius-card)] hairline transition-opacity duration-300 md:block ${
          active !== null ? "opacity-100" : "opacity-0"
        }`}
      >
        {projects.map((p, i) => (
          <img
            key={p.seed}
            src={`https://picsum.photos/seed/${p.seed}/640/512`}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ))}
      </div>
    </section>
  );
}
