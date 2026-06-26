import { videoExperiences, type VrVideo } from "@/data/videos";

export type { VrVideo };

export const vrVideos = videoExperiences;

export function getVideoBySlug(slug: string): VrVideo | undefined {
  return vrVideos.find((video) => video.id === slug);
}
