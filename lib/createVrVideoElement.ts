export function createVrVideoElement(src: string): HTMLVideoElement {
  const video = document.createElement("video");
  video.src = src;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.muted = false;
  return video;
}
