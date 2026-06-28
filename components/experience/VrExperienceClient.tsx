"use client";

import type { Video360LayoutConfig } from "@/lib/detectVideoLayout";
import { consumeVrAutostart } from "@/lib/vrAutostart";
import dynamic from "next/dynamic";
import { useEffect } from "react";

const Video360Player = dynamic(() => import("./Video360Player"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-black text-sm text-white/70">
      Loading VR experience…
    </div>
  ),
});

type VrExperienceClientProps = {
  videoId: string;
  src: string;
  title: string;
  configuredLayout?: Video360LayoutConfig;
};

export default function VrExperienceClient({
  videoId,
  ...playerProps
}: VrExperienceClientProps) {
  useEffect(() => {
    consumeVrAutostart(videoId);
  }, [videoId]);

  return <Video360Player {...playerProps} autoEnterVr />;
}
