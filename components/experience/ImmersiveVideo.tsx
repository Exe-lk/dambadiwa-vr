"use client";

import type { Video360Layout } from "@/lib/detectVideoLayout";
import { XRLayer, useXR } from "@react-three/xr";

type ImmersiveVideoProps = {
  video: HTMLVideoElement;
  layout: Video360Layout;
};

export default function ImmersiveVideo({ video, layout }: ImmersiveVideoProps) {
  const inVR = useXR((state) => state.mode === "immersive-vr");

  if (!inVR) return null;

  return <XRLayer src={video} shape="equirect" layout={layout} />;
}
