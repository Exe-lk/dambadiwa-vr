"use client";

import type { Video360Layout } from "@/lib/detectVideoLayout";
import {
  useXR,
  useXRSessionFeatureEnabled,
  useXRStore,
} from "@react-three/xr";
import { useEffect, useRef, useState } from "react";
import type { Mesh } from "three";

const EQUIRECT_LAYER_PROPS = {
  centralHorizontalAngle: Math.PI * 2,
  upperVerticalAngle: Math.PI / 2,
  lowerVerticalAngle: -Math.PI / 2,
  radius: 10,
} as const;

type NativeEquirectVideoProps = {
  video: HTMLVideoElement;
  layout: Video360Layout;
};

/**
 * WebXR equirect media layer centered on the viewer (local space).
 * Using local-floor places the sphere at the feet — head ends up above center
 * and looking up shows black outside the layer.
 */
export default function NativeEquirectVideo({
  video,
  layout,
}: NativeEquirectVideoProps) {
  const session = useXR((state) => state.session);
  const mediaBinding = useXR((state) => state.mediaBinding);
  const layersEnabled = useXRSessionFeatureEnabled("layers");
  const store = useXRStore();
  const meshRef = useRef<Mesh>(null);
  const layerEntryRef = useRef<{
    layer: XREquirectLayer;
    renderOrder: number;
    object3D: Mesh;
  } | null>(null);
  const [viewerSpace, setViewerSpace] = useState<XRReferenceSpace | null>(
    null,
  );

  useEffect(() => {
    if (!session) {
      setViewerSpace(null);
      return;
    }

    let cancelled = false;
    void session.requestReferenceSpace("local").then((space) => {
      if (!cancelled) {
        setViewerSpace(space);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [session]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (
      !session ||
      !layersEnabled ||
      !mediaBinding ||
      !viewerSpace ||
      !mesh
    ) {
      return;
    }

    const layer = mediaBinding.createEquirectLayer(video, {
      space: viewerSpace,
      layout,
    });

    if (!(layer instanceof XREquirectLayer)) {
      console.warn(
        "[NativeEquirectVideo] XRMediaBinding.createEquirectLayer failed",
      );
      return;
    }

    layer.centralHorizontalAngle =
      EQUIRECT_LAYER_PROPS.centralHorizontalAngle;
    layer.upperVerticalAngle = EQUIRECT_LAYER_PROPS.upperVerticalAngle;
    layer.lowerVerticalAngle = EQUIRECT_LAYER_PROPS.lowerVerticalAngle;
    layer.radius = EQUIRECT_LAYER_PROPS.radius;

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
    viewerSpace,
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
