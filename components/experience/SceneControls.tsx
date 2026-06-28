"use client";

import { useXrSessionActive } from "@/lib/useXrSessionActive";
import { OrbitControls } from "@react-three/drei";

export default function SceneControls() {
  const sessionActive = useXrSessionActive();

  if (sessionActive) return null;

  return (
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      rotateSpeed={-0.4}
      target={[0, 0, 0]}
    />
  );
}
