/** Wait until the video element has dimensions (required for WebXR equirect media layers). */
export function waitForVideoMetadata(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA && video.videoWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const onReady = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Video failed to load"));
    };
    const cleanup = () => {
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("loadedmetadata", onReady, { once: true });
    video.addEventListener("error", onError, { once: true });
  });
}

/** Ensure the video is playing before entering VR (Quest requires a user gesture for play). */
export async function prepareVideoForVr(
  video: HTMLVideoElement,
): Promise<void> {
  await waitForVideoMetadata(video);
  if (video.paused) {
    await video.play();
  }
}
