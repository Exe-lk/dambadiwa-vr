export type Video360Layout =
  | "mono"
  | "stereo-top-bottom"
  | "stereo-left-right";

export type Video360LayoutConfig = Video360Layout | "auto";

export function detectLayoutFromDimensions(
  width: number,
  height: number,
): Video360Layout | "ambiguous" {
  if (width <= 0 || height <= 0) return "ambiguous";

  const ratio = width / height;

  if (ratio >= 0.9 && ratio <= 1.1) {
    return "stereo-top-bottom";
  }

  if (ratio >= 1.7 && ratio <= 2.3) {
    return "ambiguous";
  }

  if (ratio >= 3.5) {
    return "stereo-left-right";
  }

  return "mono";
}

export function resolveLayout(
  configured: Video360LayoutConfig | undefined,
  width: number,
  height: number,
): Video360Layout {
  if (configured && configured !== "auto") {
    return configured;
  }

  const detected = detectLayoutFromDimensions(width, height);
  if (detected === "ambiguous") {
    return "mono";
  }

  return detected;
}

export function getLayoutLabel(layout: Video360Layout): string {
  switch (layout) {
    case "mono":
      return "Mono 360";
    case "stereo-top-bottom":
      return "Stereo TB";
    case "stereo-left-right":
      return "Stereo SBS";
  }
}
