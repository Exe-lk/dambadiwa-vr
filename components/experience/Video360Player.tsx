"use client";

import ImmersiveVideo from "@/components/experience/ImmersiveVideo";
import SceneControls from "@/components/experience/SceneControls";
import VideoSphere from "@/components/experience/VideoSphere";
import type { Video360Layout, Video360LayoutConfig } from "@/lib/detectVideoLayout";
import {
  getLayoutLabel,
  resolveLayout,
} from "@/lib/detectVideoLayout";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

const xrStore = createXRStore({
  controller: false,
  hand: false,
  transientPointer: false,
  gaze: false,
  screenInput: false,
});

type Video360PlayerProps = {
  src: string;
  title: string;
  configuredLayout?: Video360LayoutConfig;
};

function VrIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 8h16a2 2 0 012 2v4a2 2 0 01-2 2h-2.5l-1.5 2.5a1 1 0 01-1.7 0L14.5 16H9.5L8 18.5a1 1 0 01-1.7 0L5 16H4a2 2 0 01-2-2v-4a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Video360Player({
  src,
  title,
  configuredLayout = "auto",
}: Video360PlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [layout, setLayout] = useState<Video360Layout>(() =>
    configuredLayout && configuredLayout !== "auto"
      ? configuredLayout
      : "mono",
  );
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null,
  );
  const configuredLayoutRef = useRef(configuredLayout);
  configuredLayoutRef.current = configuredLayout;

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
    setVideoElement(video);

    const updateLayout = () => {
      setLayout(
        resolveLayout(
          configuredLayoutRef.current,
          video.videoWidth,
          video.videoHeight,
        ),
      );
    };

    if (video.videoWidth > 0) {
      updateLayout();
      return;
    }

    video.addEventListener("loadedmetadata", updateLayout, { once: true });
  }, []);

  const togglePlay = () => {
    setPlaying((current) => !current);
  };

  const handleEnterVR = () => {
    if (!playing) {
      setPlaying(true);
    }
    void xrStore.enterVR();
  };

  return (
    <div className="relative h-screen w-full bg-black">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <XR store={xrStore}>
          <VideoSphere
            src={src}
            layout={layout}
            playing={playing}
            onVideoReady={handleVideoReady}
          />
          {videoElement && (
            <ImmersiveVideo video={videoElement} layout={layout} />
          )}
          <SceneControls />
        </XR>
      </Canvas>

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 md:p-6">
        <div className="pointer-events-auto flex items-start justify-between gap-4">
          <Link
            href="/#experiences"
            className="rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            ← Back
          </Link>
          <div className="flex flex-col items-end gap-2">
            <h1 className="max-w-md text-right font-serif text-lg text-white/90 md:text-xl">
              {title}
            </h1>
            <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/60 backdrop-blur-sm">
              {getLayoutLabel(layout)}
            </span>
          </div>
        </div>

        {!playing && (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-black/60 text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
              aria-label="Play 360 video"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 12 12"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M2 1.5v9l8-4.5L2 1.5z" />
              </svg>
            </button>
          </div>
        )}

        <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="rounded-lg border border-white/20 bg-black/50 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={handleEnterVR}
            className="inline-flex items-center gap-2 rounded-lg border border-gold bg-black/50 px-5 py-2.5 text-sm text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
          >
            <VrIcon />
            Enter VR
          </button>
        </div>
      </div>

      {!playing && (
        <p className="pointer-events-none absolute bottom-24 left-0 right-0 text-center text-xs text-white/50 md:text-sm">
          Drag to look around · Tap Enter VR on a Meta Quest headset
        </p>
      )}
    </div>
  );
}
