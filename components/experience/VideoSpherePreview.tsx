"use client";

import { applyLayoutToTexture } from "@/lib/applyVideoLayoutTexture";
import type { Video360Layout } from "@/lib/detectVideoLayout";
import { useXrSessionActive } from "@/lib/useXrSessionActive";
import { useEffect, useState } from "react";
import * as THREE from "three";

type VideoSpherePreviewProps = {
  video: HTMLVideoElement;
  layout: Video360Layout;
  playing: boolean;
};

/** Flat-browser 360 preview only. Never rendered during an active WebXR session. */
export default function VideoSpherePreview({
  video,
  layout,
  playing,
}: VideoSpherePreviewProps) {
  const sessionActive = useXrSessionActive();
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    applyLayoutToTexture(videoTexture, layout);
    setTexture(videoTexture);

    return () => {
      videoTexture.dispose();
    };
  }, [video, layout]);

  useEffect(() => {
    if (playing) {
      void video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [playing, video]);

  if (sessionActive || !texture) {
    return null;
  }

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
