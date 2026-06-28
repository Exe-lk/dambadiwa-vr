export function isSecureContextForWebXR(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return window.isSecureContext;
}

export function getSecureContextMessage(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (window.isSecureContext) {
    return null;
  }
  return "WebXR requires HTTPS. Open this site over https:// on your Quest, not http:// on a local IP address.";
}

export async function checkImmersiveVrSupport(): Promise<boolean> {
  if (typeof navigator === "undefined" || navigator.xr == null) {
    return false;
  }
  try {
    return (await navigator.xr.isSessionSupported("immersive-vr")) ?? false;
  } catch {
    return false;
  }
}

export function formatVrError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Could not enter VR. Try Meta Quest Browser over HTTPS.";
}

export function requestImmersiveVr(
  enterVR: () => Promise<unknown>,
): Promise<unknown> {
  return enterVR();
}
