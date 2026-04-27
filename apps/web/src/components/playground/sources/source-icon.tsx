import type { Source } from "@context-layer/mocks";
import { FileText, GitBranch, MessageSquare } from "lucide-react";

interface Palette {
  bg: string;
  fg: string;
  Icon: typeof FileText;
}

function paletteFor(s: Source): Palette {
  if (s.kind === "code") {
    return { bg: "#eff6ff", fg: "#1d4ed8", Icon: GitBranch };
  }
  if (s.kind === "discussion") {
    return { bg: "#fffbeb", fg: "#b45309", Icon: MessageSquare };
  }
  return { bg: "#f5f5f5", fg: "#525252", Icon: FileText };
}

export function SourceIcon({ source, size = 28 }: { source: Source; size?: number }) {
  const { bg, fg, Icon } = paletteFor(source);
  const iconSize = Math.round(size * 0.57);
  return (
    <span
      className="rounded-standard flex items-center justify-center shrink-0"
      style={{ width: size + 12, height: size + 12, backgroundColor: bg, color: fg }}
    >
      <Icon size={iconSize} strokeWidth={1.5} />
    </span>
  );
}
