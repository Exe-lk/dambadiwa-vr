"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

type VideoSphereProps = {
  src: string;
  playing: boolean;
  onVideoReady?: (video: HTMLVideoElement) => void;
};

export default function VideoSphere({
  src,
  playing,
  onVideoReady,
}: VideoSphereProps) {
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;

    setTexture(videoTexture);
    onVideoReady?.(video);

    return () => {
      video.pause();
      video.src = "";
      videoTexture.dispose();
    };
  }, [src, onVideoReady]);

  useEffect(() => {
    if (!texture) return;

    const video = texture.image as HTMLVideoElement;
    if (playing) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing, texture]);

  if (!texture) return null;

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
