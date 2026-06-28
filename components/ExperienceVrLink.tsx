"use client";

import { markVrAutostart } from "@/lib/vrAutostart";
import type { ReactNode } from "react";

type ExperienceVrLinkProps = {
  videoId: string;
  className?: string;
  children: ReactNode;
};

export default function ExperienceVrLink({
  videoId,
  className,
  children,
}: ExperienceVrLinkProps) {
  const href = `/vr/${videoId}`;

  return (
    <a
      href={href}
      className={className}
      onPointerDown={() => {
        markVrAutostart(videoId);
      }}
      onClick={(event) => {
        event.preventDefault();
        markVrAutostart(videoId);
        window.location.assign(href);
      }}
    >
      {children}
    </a>
  );
}
