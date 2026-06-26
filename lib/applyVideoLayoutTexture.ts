import type { Video360Layout } from "@/lib/detectVideoLayout";
import * as THREE from "three";

export function applyLayoutToTexture(
  texture: THREE.VideoTexture,
  layout: Video360Layout,
) {
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  switch (layout) {
    case "mono":
      texture.repeat.set(1, 1);
      texture.offset.set(0, 0);
      break;
    case "stereo-top-bottom":
      texture.repeat.set(1, 0.5);
      texture.offset.set(0, 0.5);
      break;
    case "stereo-left-right":
      texture.repeat.set(0.5, 1);
      texture.offset.set(0, 0);
      break;
  }

  texture.needsUpdate = true;
}
