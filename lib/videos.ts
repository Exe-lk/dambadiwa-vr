import { videoExperiences, type VrVideo } from "@/data/videos";

export type { VrVideo };
export type {
  Video360Layout,
  Video360LayoutConfig,
} from "@/lib/detectVideoLayout";
export { getLayoutLabel } from "@/lib/detectVideoLayout";

export const vrVideos = videoExperiences;

export function getVideoBySlug(slug: string): VrVideo | undefined {
  return vrVideos.find((video) => video.id === slug);
}
