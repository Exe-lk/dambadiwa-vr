"use client";

import type { Video360Layout } from "@/lib/detectVideoLayout";
import {
  XRLayer,
  useXR,
  useXRSessionFeatureEnabled,
} from "@react-three/xr";

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

/**
 * Native WebXR equirect media layer (Quest compositor). Only mounts when immersive-vr
 * is active and the session grants the `layers` feature — never the Three.js mesh fallback.
 */
export default function ImmersiveVideo({ video, layout }: ImmersiveVideoProps) {
  const inVR = useXR((state) => state.mode === "immersive-vr");
  const layersEnabled = useXRSessionFeatureEnabled("layers");

  if (!inVR || !layersEnabled) return null;

  return (
    <XRLayer
      src={video}
      shape="equirect"
      layout={layout}
      {...FULL_EQUIRECT_ANGLES}
    />
  );
}
