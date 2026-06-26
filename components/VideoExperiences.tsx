import Link from "next/link";
import { vrVideos } from "@/lib/videos";

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
            <div className="mb-6 flex flex-col gap-4 px-6 sm:flex-row sm:items-start sm:justify-between md:px-12 lg:px-16">
              <div className="max-w-3xl">
                <h3 className="font-serif text-2xl md:text-3xl">{video.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-base">
                  {video.description}
                </p>
              </div>
              <Link
                href={`/vr/${video.id}`}
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg border border-gold px-5 py-3 text-sm text-gold transition-colors hover:bg-gold/10 sm:self-center"
              >
                <VrIcon />
                Experience in VR
              </Link>
            </div>

            <div className="p-6 md:p-12 lg:p-16">
              <video
                src={video.src}
                controls
                playsInline
                preload="metadata"
                crossOrigin="anonymous"
                className="aspect-video w-full bg-black"
              >
                Your browser does not support video playback.
              </video>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
