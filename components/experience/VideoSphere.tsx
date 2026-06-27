"use client";

import { applyLayoutToTexture } from "@/lib/applyVideoLayoutTexture";
import type { Video360Layout } from "@/lib/detectVideoLayout";
import { useXR } from "@react-three/xr";
import { useEffect, useState } from "react";
import * as THREE from "three";

type VideoSphereProps = {
  src: string;
  playing: boolean;
  layout: Video360Layout;
  onVideoReady?: (video: HTMLVideoElement) => void;
  onVideoError?: (message: string) => void;
};

export default function VideoSphere({
  src,
  playing,
  layout,
  onVideoReady,
  onVideoError,
}: VideoSphereProps) {
  const inVR = useXR((state) => state.mode === "immersive-vr");
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";

    const handleError = () => {
      const mediaError = video.error;
      const code = mediaError?.code;
      const message =
        code === MediaError.MEDIA_ERR_NETWORK
          ? "Video failed to load. Check your connection and CDN CORS settings."
          : code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED
            ? "This video format is not supported by your browser."
            : "Video failed to load.";
      onVideoError?.(message);
    };

    video.addEventListener("error", handleError);

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.generateMipmaps = false;
    applyLayoutToTexture(videoTexture, layout);

    setTexture(videoTexture);
    onVideoReady?.(video);

    return () => {
      video.removeEventListener("error", handleError);
      video.pause();
      video.src = "";
      videoTexture.dispose();
    };
  }, [src, onVideoReady, onVideoError]);

  useEffect(() => {
    if (!texture) return;
    applyLayoutToTexture(texture, layout);
  }, [layout, texture]);

  useEffect(() => {
    if (!texture) return;

    const video = texture.image as HTMLVideoElement;
    if (playing) {
      void video.play().catch(() => {
        onVideoError?.(
          "Playback was blocked. Tap Play, then Enter VR again.",
        );
      });
    } else {
      video.pause();
    }
  }, [playing, texture, onVideoError]);

  if (inVR || !texture) return null;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
