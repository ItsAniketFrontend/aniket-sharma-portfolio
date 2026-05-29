"use client";

import dynamic from "next/dynamic";

// 3D runs client-only. Skip SSR so the build stays clean and the bundle
// loads after first paint.
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <span className="h-24 w-24 animate-pulse rounded-full bg-flame/20 blur-xl" />
    </div>
  ),
});

export default function HeroCanvas() {
  return <HeroScene />;
}
