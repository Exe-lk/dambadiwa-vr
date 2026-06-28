"use client";

import SceneControls from "@/components/experience/SceneControls";
import VideoSphere from "@/components/experience/VideoSphere";
import type { Video360Layout, Video360LayoutConfig } from "@/lib/detectVideoLayout";
import {
  getLayoutLabel,
  resolveLayout,
} from "@/lib/detectVideoLayout";
import {
  checkImmersiveVrSupport,
  formatVrError,
  getSecureContextMessage,
  requestImmersiveVr,
} from "@/lib/webxr";
import { Canvas } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const xrStore = createXRStore({
  controller: false,
  hand: false,
  transientPointer: false,
  gaze: false,
  screenInput: false,
  domOverlay: false,
  offerSession: "immersive-vr",
  enterGrantedSession: ["immersive-vr"],
});

type Video360PlayerProps = {
  src: string;
  title: string;
  configuredLayout?: Video360LayoutConfig;
  autoEnterVr?: boolean;
};

export default function Video360Player({
  src,
  title,
  configuredLayout = "auto",
  autoEnterVr = true,
}: Video360PlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [layout, setLayout] = useState<Video360Layout>(() =>
    configuredLayout && configuredLayout !== "auto"
      ? configuredLayout
      : "mono",
  );
  const [inVR, setInVR] = useState(false);
  const [vrSupported, setVrSupported] = useState<boolean | null>(null);
  const [vrError, setVrError] = useState<string | null>(null);
  const [enteringVr, setEnteringVr] = useState(false);
  const configuredLayoutRef = useRef(configuredLayout);
  const autoEnterAttempted = useRef(false);
  configuredLayoutRef.current = configuredLayout;

  useEffect(() => {
    const secureContextMessage = getSecureContextMessage();
    if (secureContextMessage) {
      setVrError(secureContextMessage);
      setVrSupported(false);
      setEnteringVr(false);
      return;
    }

    let cancelled = false;
    void checkImmersiveVrSupport().then((supported) => {
      if (!cancelled) {
        setVrSupported(supported);
        if (!supported) {
          setVrError(
            "Immersive VR is not available in this browser. Use Meta Quest Browser over HTTPS.",
          );
          setEnteringVr(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return xrStore.subscribe((state, prevState) => {
      const immersive = state.mode === "immersive-vr";
      setInVR(immersive);
      if (immersive && !prevState.session && state.session) {
        setVrError(null);
        setEnteringVr(false);
      }
      if (!state.session && prevState.session) {
        setEnteringVr(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!autoEnterVr || autoEnterAttempted.current) {
      return;
    }
    if (vrSupported !== true) {
      return;
    }

    autoEnterAttempted.current = true;
    setPlaying(true);
    setEnteringVr(true);

    const frameId = requestAnimationFrame(() => {
      requestImmersiveVr(() => xrStore.enterVR()).catch((error: unknown) => {
        setEnteringVr(false);
        setVrError(formatVrError(error));
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [autoEnterVr, vrSupported]);

  const handleVideoReady = useCallback((video: HTMLVideoElement) => {
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

  const handleVideoError = useCallback((message: string) => {
    setVrError(message);
    setEnteringVr(false);
  }, []);

  const handleExitVR = () => {
    const session = xrStore.getState().session;
    if (session) {
      void session.end();
    }
  };

  const handleStartPreview = () => {
    setPreviewMode(true);
    setPlaying(true);
  };

  const togglePlay = () => {
    setPlaying((current) => !current);
  };

  const vrUnavailable = vrSupported === false;
  const showLoadingOverlay = enteringVr && !inVR && !vrError && !previewMode;
  const showVrUnavailableOverlay = vrUnavailable && !previewMode && !inVR;
  const showPreviewControls = previewMode && !inVR;
  const showEnterVrFailureOverlay =
    !inVR && Boolean(vrError) && !vrUnavailable && !previewMode;

  return (
    <div className="relative h-screen w-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75, near: 0.01, far: 1000 }}
        style={{ touchAction: "none" }}
      >
        <XR store={xrStore}>
          <VideoSphere
            src={src}
            layout={layout}
            playing={playing}
            onVideoReady={handleVideoReady}
            onVideoError={handleVideoError}
          />
          <SceneControls enabled={previewMode} />
        </XR>
      </Canvas>

      {showLoadingOverlay && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-6">
          <p className="font-serif text-lg text-white/90 md:text-xl">{title}</p>
          <p className="text-sm text-white/60">Entering VR…</p>
          <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/50">
            {getLayoutLabel(layout)}
          </span>
        </div>
      )}

      {showVrUnavailableOverlay && (
        <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 px-6">
          <p
            role="alert"
            className="max-w-md text-center text-sm text-red-200 md:text-base"
          >
            {vrError}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartPreview}
              className="rounded-lg border border-gold bg-black/50 px-5 py-2.5 text-sm text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
            >
              Play 360° preview
            </button>
            <Link
              href="/#experiences"
              className="rounded-lg border border-white/20 bg-black/50 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              ← Back to experiences
            </Link>
          </div>
        </div>
      )}

      {showEnterVrFailureOverlay && (
        <div className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 px-6">
          <p
            role="alert"
            className="max-w-md text-center text-sm text-red-200 md:text-base"
          >
            {vrError}
          </p>
          <Link
            href="/#experiences"
            className="rounded-lg border border-white/20 bg-black/50 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            ← Back to experiences
          </Link>
        </div>
      )}

      {showPreviewControls && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 md:p-6">
          <div className="flex w-full items-start justify-between gap-4">
            <Link
              href="/#experiences"
              className="pointer-events-auto rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              ← Back
            </Link>
            <div className="pointer-events-auto flex flex-col items-end gap-2">
              <h1 className="max-w-md text-right font-serif text-lg text-white/90 md:text-xl">
                {title}
              </h1>
              <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/60 backdrop-blur-sm">
                {getLayoutLabel(layout)}
              </span>
            </div>
          </div>

          {!playing && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={togglePlay}
                className="pointer-events-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold bg-black/60 text-gold backdrop-blur-sm transition-colors hover:bg-gold/10"
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

          <div className="pointer-events-none flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="pointer-events-auto rounded-lg border border-white/20 bg-black/50 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              {playing ? "Pause" : "Play"}
            </button>
            <p className="text-center text-xs text-white/50 md:text-sm">
              Drag to look around
            </p>
          </div>
        </div>
      )}

      {inVR && (
        <div className="pointer-events-auto absolute bottom-6 left-0 right-0 flex justify-center px-4">
          <button
            type="button"
            onClick={handleExitVR}
            className="rounded-lg border border-white/30 bg-black/60 px-5 py-2.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/80"
          >
            Exit VR
          </button>
        </div>
      )}

      {!inVR && !enteringVr && !previewMode && !vrUnavailable && !vrError && (
        <div className="pointer-events-auto absolute left-4 top-4 md:left-6 md:top-6">
          <Link
            href="/#experiences"
            className="rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            ← Back
          </Link>
        </div>
      )}
    </div>
  );
}
