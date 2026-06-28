"use client";

import type { Video360Layout } from "@/lib/detectVideoLayout";
import {
  useXR,
  useXRSessionFeatureEnabled,
  useXRStore,
} from "@react-three/xr";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";

type NativeEquirectVideoProps = {
  video: HTMLVideoElement;
  layout: Video360Layout;
};

/**
 * Native WebXR equirect media layer.
 * Uses the same reference space as the WebGL projection layer (local-floor via R3F).
 * Radius 0 = infinite sphere (orientation-only 360, per WebXR Layers spec).
 */
export default function NativeEquirectVideo({
  video,
  layout,
}: NativeEquirectVideoProps) {
  const session = useXR((state) => state.session);
  const mediaBinding = useXR((state) => state.mediaBinding);
  const originReferenceSpace = useXR((state) => state.originReferenceSpace);
  const layersEnabled = useXRSessionFeatureEnabled("layers");
  const store = useXRStore();
  const meshRef = useRef<Mesh>(null);
  const layerEntryRef = useRef<{
    layer: XREquirectLayer;
    renderOrder: number;
    object3D: Mesh;
  } | null>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (
      !session ||
      !layersEnabled ||
      !mediaBinding ||
      !originReferenceSpace ||
      !mesh
    ) {
      return;
    }

    const layer = mediaBinding.createEquirectLayer(video, {
      space: originReferenceSpace,
      layout,
    });

    if (!(layer instanceof XREquirectLayer)) {
      console.warn(
        "[NativeEquirectVideo] XRMediaBinding.createEquirectLayer failed",
      );
      return;
    }

    layer.radius = 0;
    layer.centralHorizontalAngle = Math.PI * 2;
    layer.upperVerticalAngle = Math.PI / 2;
    layer.lowerVerticalAngle = -Math.PI / 2;

    const layerEntry = {
      layer,
      renderOrder: -1,
      object3D: mesh,
    };
    layerEntryRef.current = layerEntry;
    store.addLayerEntry(layerEntry);

    return () => {
      store.removeLayerEntry(layerEntry);
      layer.destroy();
      layerEntryRef.current = null;
    };
  }, [
    session,
    layersEnabled,
    mediaBinding,
    originReferenceSpace,
    video,
    layout,
    store,
  ]);

  if (!session || !layersEnabled) {
    return null;
  }

  return (
    <mesh ref={meshRef} renderOrder={-Infinity}>
      <meshBasicMaterial colorWrite={false} />
    </mesh>
  );
}
