"use client";

import type { Video360LayoutConfig } from "@/lib/detectVideoLayout";
import dynamic from "next/dynamic";

const Video360Player = dynamic(() => import("./Video360Player"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-black text-sm text-white/70">
      Loading VR experience…
    </div>
  ),
});

type VrExperienceClientProps = {
  src: string;
  title: string;
  configuredLayout?: Video360LayoutConfig;
};

export default function VrExperienceClient(props: VrExperienceClientProps) {
  return <Video360Player {...props} />;
}
