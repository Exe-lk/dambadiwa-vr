"use client";

import type { Video360Layout } from "@/lib/detectVideoLayout";
import {
  createXRLayer,
  updateXRLayerProperties,
  updateXRLayerTransform,
} from "@pmndrs/xr";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useXR,
  useXRSessionFeatureEnabled,
  useXRStore,
} from "@react-three/xr";
import { useEffect, useRef } from "react";
import type { Mesh } from "three";

const EQUIRECT_LAYER_PROPS = {
  centralHorizontalAngle: Math.PI * 2,
  upperVerticalAngle: Math.PI / 2,
  lowerVerticalAngle: -Math.PI / 2,
} as const;

type NativeEquirectVideoProps = {
  video: HTMLVideoElement;
  layout: Video360Layout;
};

/**
 * WebXR equirect media layer via XRMediaBinding (Quest compositor).
 * Does not use XRLayer — avoids the Three.js mesh fallback entirely.
 */
export default function NativeEquirectVideo({
  video,
  layout,
}: NativeEquirectVideoProps) {
  const session = useXR((state) => state.session);
  const layersEnabled = useXRSessionFeatureEnabled("layers");
  const originReferenceSpace = useXR((state) => state.originReferenceSpace);
  const store = useXRStore();
  const gl = useThree((state) => state.gl);
  const meshRef = useRef<Mesh>(null);
  const layerEntryRef = useRef<{
    layer: XREquirectLayer;
    renderOrder: number;
    object3D: Mesh;
  } | null>(null);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!session || !layersEnabled || !originReferenceSpace || !mesh) {
      return;
    }

    const layer = createXRLayer(
      video,
      store.getState(),
      originReferenceSpace,
      gl.xr,
      mesh,
      { shape: "equirect", layout },
      EQUIRECT_LAYER_PROPS,
    );

    if (layer == null || !(layer instanceof XREquirectLayer)) {
      console.warn(
        "[NativeEquirectVideo] XRMediaBinding.createEquirectLayer failed",
      );
      return;
    }

    updateXRLayerProperties(layer, EQUIRECT_LAYER_PROPS);

    layer.radius = 0;
    layer.centralHorizontalAngle =
      EQUIRECT_LAYER_PROPS.centralHorizontalAngle;
    layer.upperVerticalAngle = EQUIRECT_LAYER_PROPS.upperVerticalAngle;
    layer.lowerVerticalAngle = EQUIRECT_LAYER_PROPS.lowerVerticalAngle;

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
    originReferenceSpace,
    video,
    layout,
    store,
    gl,
  ]);

  useFrame(() => {
    const entry = layerEntryRef.current;
    const mesh = meshRef.current;
    if (entry == null || mesh == null) {
      return;
    }
    updateXRLayerTransform(store.getState(), entry.layer, undefined, mesh);
  });

  if (!session || !layersEnabled) {
    return null;
  }

  return (
    <mesh ref={meshRef} renderOrder={-Infinity}>
      <meshBasicMaterial colorWrite={false} />
    </mesh>
  );
}
