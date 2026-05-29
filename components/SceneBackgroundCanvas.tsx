"use client";

import dynamic from "next/dynamic";

const SceneBackground = dynamic(() => import("./SceneBackground"), {
  ssr: false,
});

export default function SceneBackgroundCanvas() {
  return <SceneBackground />;
}
