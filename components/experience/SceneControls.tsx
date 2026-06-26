"use client";

import { OrbitControls } from "@react-three/drei";
import { useXR } from "@react-three/xr";

export default function SceneControls() {
  const mode = useXR((state) => state.mode);
  const inVR = mode === "immersive-vr";

  if (inVR) return null;

  return (
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      rotateSpeed={-0.4}
      target={[0, 0, 0]}
    />
  );
}
