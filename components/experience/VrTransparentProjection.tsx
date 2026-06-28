"use client";

import type { Video360Layout } from "@/lib/detectVideoLayout";
import { useXrSessionActive } from "@/lib/useXrSessionActive";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Color } from "three";

/**
 * The WebGL projection layer is composited on top of equirect layers.
 * An opaque black clear hides the 360 video — keep the projection pass transparent in VR.
 */
export default function VrTransparentProjection() {
  const sessionActive = useXrSessionActive();
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (!sessionActive) {
      return;
    }

    const previousColor = new Color();
    gl.getClearColor(previousColor);
    const previousAlpha = gl.getClearAlpha();
    const previousBackground = scene.background;

    scene.background = null;
    gl.setClearColor(0x000000, 0);

    return () => {
      scene.background = previousBackground;
      gl.setClearColor(previousColor, previousAlpha);
    };
  }, [sessionActive, gl, scene]);

  return null;
}
