"use client";

import { useThree } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type SceneControlsProps = {
  enabled?: boolean;
};

const ROTATE_SPEED = 0.002;

export default function SceneControls({ enabled = true }: SceneControlsProps) {
  const mode = useXR((state) => state.mode);
  const inVR = mode === "immersive-vr";
  const { camera, gl } = useThree();
  const dragging = useRef(false);
  const pointerId = useRef<number | null>(null);
  const last = useRef({ x: 0, y: 0 });
  const euler = useRef(new THREE.Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    if (inVR || !enabled) {
      return;
    }

    const element = gl.domElement.parentElement ?? gl.domElement;
    element.style.touchAction = "none";
    element.style.cursor = "grab";

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      dragging.current = true;
      pointerId.current = event.pointerId;
      last.current = { x: event.clientX, y: event.clientY };
      element.setPointerCapture(event.pointerId);
      element.style.cursor = "grabbing";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging.current || pointerId.current !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - last.current.x;
      const deltaY = event.clientY - last.current.y;
      last.current = { x: event.clientX, y: event.clientY };

      euler.current.y += deltaX * ROTATE_SPEED;
      euler.current.x += deltaY * ROTATE_SPEED;
      euler.current.x = THREE.MathUtils.clamp(
        euler.current.x,
        -Math.PI / 2 + 0.01,
        Math.PI / 2 - 0.01,
      );

      camera.quaternion.setFromEuler(euler.current);
    };

    const endDrag = (event: PointerEvent) => {
      if (pointerId.current !== event.pointerId) {
        return;
      }

      dragging.current = false;
      pointerId.current = null;
      element.style.cursor = "grab";

      if (element.hasPointerCapture(event.pointerId)) {
        element.releasePointerCapture(event.pointerId);
      }
    };

    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointermove", onPointerMove);
    element.addEventListener("pointerup", endDrag);
    element.addEventListener("pointercancel", endDrag);

    return () => {
      element.style.touchAction = "";
      element.style.cursor = "";
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointermove", onPointerMove);
      element.removeEventListener("pointerup", endDrag);
      element.removeEventListener("pointercancel", endDrag);
    };
  }, [camera, gl, enabled, inVR]);

  return null;
}
