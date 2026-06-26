import type { Video360LayoutConfig } from "@/lib/detectVideoLayout";

export type VrVideo = {
  id: string;
  title: string;
  description: string;
  src: string;
  layout?: Video360LayoutConfig;
};

export const videoExperiences: VrVideo[] = [
  {
    id: "sacred-journey",
    title: "Sacred Journey to Mihintale",
    description:
      "Walk among devotees at the sacred stupa during Poson — a 360° glimpse of Sri Lanka's spiritual heartland.",
    src: "https://vrvesak-cdn.b-cdn.net/The%20Nun%20360%20-%20Valak%20Horror%20Chase%20360%20VR%20Video%20-%20The%20Conjuring%20-%20360%20Video%20Horror%20Annabelle.mp4",
    layout: "stereo-top-bottom",
  },
  {
    id: "roller-coaster",
    title: "Sacred Journey in Roller Coaster",
    description:
      "Rollers coaster experience in 360°.",
    src: "https://vrvesak-cdn.b-cdn.net/roller_coater.mp4",
    layout: "stereo-top-bottom",
  },
];
