import { useXR } from "@react-three/xr";

/** True while an immersive WebXR session is active (more reliable than `mode` alone). */
export function useXrSessionActive(): boolean {
  return useXR((state) => state.session != null);
}
