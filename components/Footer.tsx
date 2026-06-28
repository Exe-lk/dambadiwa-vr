import { appVersion } from "@/lib/version";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t border-white/10 bg-neutral-950 text-white/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-5 text-center text-sm sm:flex-row sm:text-left md:px-12">
        <p className="font-serif text-white/80">Dabadiwa Wandana</p>

        <p className="text-white/50">
          © {year} Sacred Buddhist pilgrimage experiences
        </p>

        <p className="font-mono text-xs tracking-wide text-gold/90">
          v{appVersion}
        </p>
      </div>
    </footer>
  );
}
