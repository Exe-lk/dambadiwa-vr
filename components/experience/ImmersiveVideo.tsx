"use client";

import type { Video360Layout } from "@/lib/detectVideoLayout";
import { XRLayer, useXR } from "@react-three/xr";

type ImmersiveVideoProps = {
  video: HTMLVideoElement;
  layout: Video360Layout;
};

// @react-three/xr defaults equirect to a 60° wedge; full 360 needs explicit angles.
const FULL_EQUIRECT_ANGLES = {
  centralHorizontalAngle: Math.PI * 2,
  upperVerticalAngle: Math.PI / 2,
  lowerVerticalAngle: -Math.PI / 2,
} as const;

export default function ImmersiveVideo({ video, layout }: ImmersiveVideoProps) {
  const inVR = useXR((state) => state.mode === "immersive-vr");

  if (!inVR) return null;

  return (
    <XRLayer
      src={video}
      shape="equirect"
      layout={layout}
      {...FULL_EQUIRECT_ANGLES}
    />
  );
}
