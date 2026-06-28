const VR_AUTOSTART_KEY = "dabadiwa-vr-autostart";

export function markVrAutostart(videoId: string) {
  sessionStorage.setItem(VR_AUTOSTART_KEY, videoId);
}

export function consumeVrAutostart(videoId: string): boolean {
  if (sessionStorage.getItem(VR_AUTOSTART_KEY) !== videoId) {
    return false;
  }
  sessionStorage.removeItem(VR_AUTOSTART_KEY);
  return true;
}
