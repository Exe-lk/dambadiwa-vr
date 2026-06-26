import Video360Player from "@/components/experience/Video360Player";
import { getVideoBySlug, vrVideos } from "@/lib/videos";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type VrPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return vrVideos.map((video) => ({ slug: video.id }));
}

export async function generateMetadata({
  params,
}: VrPageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    return { title: "Experience Not Found | Poson Sri Lanka" };
  }

  return {
    title: `${video.title} | VR Experience`,
    description: video.description,
  };
}

export default async function VrExperiencePage({ params }: VrPageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col">
      <Video360Player
        src={video.src}
        title={video.title}
        configuredLayout={video.layout}
      />
    </main>
  );
}
