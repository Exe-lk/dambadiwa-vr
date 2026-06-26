import Hero from "@/components/Hero";
import VideoExperiences from "@/components/VideoExperiences";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <VideoExperiences />
    </main>
  );
}
