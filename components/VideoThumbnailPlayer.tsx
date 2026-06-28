"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type VideoThumbnailPlayerProps = {
  src: string;
  title: string;
  vrHref: string;
  thumbnail?: string;
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

function PlayIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="ml-1 text-white"
    >
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function captureVideoFrame(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    const cleanup = () => {
      video.removeAttribute("src");
      video.load();
    };

    video.addEventListener("error", () => {
      cleanup();
      resolve(null);
    });

    video.addEventListener("loadeddata", () => {
      video.currentTime = Math.min(0.5, video.duration || 0.5);
    });

    video.addEventListener("seeked", () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        if (!context || canvas.width === 0 || canvas.height === 0) {
          cleanup();
          resolve(null);
          return;
        }
        context.drawImage(video, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      } catch {
        resolve(null);
      } finally {
        cleanup();
      }
    });

    video.src = src;
  });
}

export default function VideoThumbnailPlayer({
  src,
  title,
  vrHref,
  thumbnail,
}: VideoThumbnailPlayerProps) {
  const [posterUrl, setPosterUrl] = useState(thumbnail ?? "");

  useEffect(() => {
    if (thumbnail) {
      return;
    }

    let cancelled = false;

    captureVideoFrame(src).then((frame) => {
      if (!cancelled && frame) {
        setPosterUrl(frame);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [src, thumbnail]);

  return (
    <div className="group relative aspect-video w-full overflow-hidden bg-black">
      {posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="h-full w-full bg-neutral-900" />
      )}

      <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/40" />

      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href={vrHref}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-black/70 ring-2 ring-gold transition-transform group-hover:scale-105 md:h-20 md:w-20"
          aria-label={`Play ${title}`}
        >
          <PlayIcon />
        </Link>
      </div>

      <Link
        href={vrHref}
        className="absolute right-4 bottom-4 z-10 inline-flex items-center gap-2 rounded-lg border border-gold bg-black/70 px-5 py-3 text-sm text-gold backdrop-blur-sm transition-colors hover:bg-gold/20"
      >
        <VrIcon />
        Experience in VR
      </Link>
    </div>
  );
}
