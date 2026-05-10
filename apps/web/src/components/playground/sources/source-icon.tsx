import type { Source } from "@context-layer/mocks";
import { IconMark, sourceIconForCategory } from "../icons/icon-mark";

interface Palette {
  bg: string;
}

function paletteFor(s: Source): Palette {
  if (s.kind === "code") {
    return { bg: "#eff6ff" };
  }
  if (s.kind === "discussion") {
    return { bg: "#fffbeb" };
  }
  return { bg: "#f5f5f5" };
}

export function SourceIcon({ source, size = 28 }: { source: Source; size?: number }) {
  const { bg } = paletteFor(source);
  const icon = sourceIconForCategory(source.category);
  const iconSize = Math.round(size * 0.72);
  return (
    <span
      className="rounded-standard flex items-center justify-center shrink-0"
      style={{ width: size + 12, height: size + 12, backgroundColor: bg }}
    >
      <IconMark icon={icon} size={iconSize} />
    </span>
  );
}
