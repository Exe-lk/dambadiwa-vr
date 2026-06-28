"use client";

import NativeEquirectVideo from "@/components/experience/NativeEquirectVideo";
import SceneControls from "@/components/experience/SceneControls";
import VideoSpherePreview from "@/components/experience/VideoSpherePreview";
import type { Video360Layout, Video360LayoutConfig } from "@/lib/detectVideoLayout";
import {
  getLayoutLabel,
  resolveLayout,
} from "@/lib/detectVideoLayout";
import { createVrVideoElement } from "@/lib/createVrVideoElement";
import { prepareVideoForVr } from "@/lib/prepareVideoForVr";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const xrStore = createXRStore({
  controller: false,
  hand: false,
  transientPointer: false,
  gaze: false,
  screenInput: false,
  domOverlay: false,
  layers: "required",
  offerSession: "immersive-vr",
  customSessionInit: {
    requiredFeatures: ["local", "layers"],
    optionalFeatures: [],
  },
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
  const [enteringVr, setEnteringVr] = useState(false);
  const [vrError, setVrError] = useState<string | null>(null);
  const configuredLayoutRef = useRef(configuredLayout);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  configuredLayoutRef.current = configuredLayout;

  useEffect(() => {
    const video = createVrVideoElement(src);
    videoElementRef.current = video;
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
    } else {
      video.addEventListener("loadedmetadata", updateLayout, { once: true });
    }

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      videoElementRef.current = null;
    };
  }, [src]);

  const togglePlay = () => {
    setPlaying((current) => !current);
  };

  const handleEnterVR = async () => {
    const video = videoElementRef.current;
    if (!video || enteringVr) return;

    setVrError(null);
    setEnteringVr(true);

    try {
      if (!playing) {
        setPlaying(true);
      }
      await prepareVideoForVr(video);

      const session = await xrStore.enterVR();
      if (session == null) {
        setVrError("Could not start a VR session on this device.");
        return;
      }

      if (!session.enabledFeatures?.includes("layers")) {
        await session.end();
        setVrError(
          "WebXR layers are required for native 360° video on this device.",
        );
      }
    } catch {
      setVrError(
        "Could not enter VR. Use Meta Quest Browser over HTTPS and try again.",
      );
    } finally {
      setEnteringVr(false);
    }
  };

  return (
    <div className="relative h-full min-h-0 w-full flex-1 bg-black">
      <Canvas camera={{ position: [0, 0, 0], fov: 75 }}>
        <XR store={xrStore}>
          {videoElement && (
            <>
              <VideoSpherePreview
                video={videoElement}
                layout={layout}
                playing={playing}
              />
              <NativeEquirectVideo video={videoElement} layout={layout} />
            </>
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
            onClick={() => void handleEnterVR()}
            disabled={!videoElement || enteringVr}
            className="inline-flex items-center gap-2 rounded-lg border border-gold bg-black/50 px-5 py-2.5 text-sm text-gold backdrop-blur-sm transition-colors hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <VrIcon />
            {enteringVr ? "Entering VR…" : "Enter VR"}
          </button>
        </div>
      </div>

      {vrError && (
        <p className="pointer-events-none absolute bottom-36 left-0 right-0 px-6 text-center text-xs text-red-300/90 md:text-sm">
          {vrError}
        </p>
      )}

      {!playing && (
        <p className="pointer-events-none absolute bottom-24 left-0 right-0 text-center text-xs text-white/50 md:text-sm">
          Drag to look around · Tap Enter VR on a Meta Quest headset
        </p>
      )}
    </div>
  );
}
