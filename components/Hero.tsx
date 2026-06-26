import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "#", active: false },
  { label: "Experiences", href: "#experiences" },
  // { label: "About Poson", href: "#about", active: false },
  // { label: "Gallery", href: "#gallery", active: false },
  // { label: "Contact", href: "#contact", active: false },
];

function StupaLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" stroke="#C5A059" strokeWidth="1.5" />
      <path
        d="M20 8 L20 32 M12 32 L28 32 M14 28 L26 28 M16 24 L24 24 M18 20 L22 20 M19 12 L21 12 M19 16 L21 16"
        stroke="#C5A059"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="20" cy="10" rx="4" ry="2" fill="#C5A059" />
    </svg>
  );
}

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

function PlayIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M2 1.5v9l8-4.5L2 1.5z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] max-h-[80vh] w-full overflow-hidden md:max-h-none md:min-h-screen">
      <Image
        src="/dabadiwa.png"
        alt="Sacred Buddhist pilgrimage from Sri Lanka to historic holy sites in India"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />

      <div className="relative z-10 flex min-h-[70vh] max-h-[80vh] flex-col md:max-h-none md:min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 md:px-12 md:py-6 lg:px-16">
          <Link href="/" className="flex items-center gap-3">
            <StupaLogo />
            <div className="font-serif leading-tight text-white">
              <span className="block text-lg font-semibold tracking-wide">
                DABADIWA
              </span>
              <span className="block text-xs tracking-[0.2em] opacity-90">
                WANDANA
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-sm tracking-wide transition-colors ${
                  link.active
                    ? "text-gold after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-gold"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/#experiences"
            className="flex items-center gap-2 rounded-lg border border-gold px-4 py-2.5 text-sm text-gold transition-colors hover:bg-gold/10"
          >
            <VrIcon />
            <span className="hidden sm:inline">Experience in VR</span>
            <span className="sm:hidden">VR</span>
          </Link>
        </header>

        <div className="flex flex-1 flex-col justify-center px-6 pb-12 md:px-12 md:pb-20 lg:px-16">
          <div className="max-w-xl">
            <h1 className="font-serif text-3xl leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
              Dabadiwa Wandana
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 sm:text-base md:mt-6 md:text-lg">
              Sacred Buddhist pilgrimage from Sri Lanka to the historic Buddhist
              holy sites in India.
            </p>
            <Link
              href="/#experiences"
              className="mt-6 inline-flex items-center gap-3 rounded-lg border border-gold px-6 py-3.5 text-sm text-gold transition-colors hover:bg-gold/10 md:mt-8"
            >
              <PlayIcon />
              Watch Trailer (360°)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
