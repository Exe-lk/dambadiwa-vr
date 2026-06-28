import VideoThumbnailPlayer from "@/components/VideoThumbnailPlayer";
import { vrVideos } from "@/lib/videos";

export default function VideoExperiences() {
  return (
    <section id="experiences" className="bg-neutral-950 text-white">
      <div className="px-6 py-16 text-center md:px-12 md:py-20 lg:px-16">
        <h2 className="font-serif text-4xl md:text-5xl">VR Experiences</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
          Explore Poson in immersive 360°. Watch below in your browser, or open
          an experience in VR on your Meta Quest headset.
        </p>
      </div>

      <div className="flex flex-col gap-20 pb-20">
        {vrVideos.map((video) => (
          <article key={video.id}>
            <div className="mb-6 max-w-3xl px-6 md:px-12 lg:px-16">
              <h3 className="font-serif text-2xl md:text-3xl">{video.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-base">
                {video.description}
              </p>
            </div>

            <div className="p-6 md:p-12 lg:p-16">
              <VideoThumbnailPlayer
                src={video.src}
                title={video.title}
                vrHref={`/vr/${video.id}`}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
