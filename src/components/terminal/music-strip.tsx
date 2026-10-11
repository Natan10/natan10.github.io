"use client";

import type { Content } from "@/content/types";
import { MusicStripEmbed } from "./music-strip-embed";
import { MusicStripHeader } from "./music-strip-header";
import { useTerminal } from "./terminal-provider";

/**
 * The player strip above the statusline; rendered only while it is open.
 * Always 108px tall including its 1px top border: 28px header (border
 * included) + 80px embed.
 */
export function MusicStrip({ playlist }: { playlist: Content["playlist"] }) {
  const { musicOpen, dict } = useTerminal();
  if (!musicOpen) return null;
  return (
    <aside
      aria-label={dict.music.landmark}
      className="fixed bottom-8 left-0 right-0 z-40 box-border h-[108px] bg-surface-container-low border-t border-primary [&>header]:h-[27px] md:left-auto md:right-margin md:w-[480px] md:border md:border-b-0 md:shadow-[4px_-4px_0_0_#000]"
    >
      <MusicStripHeader playlist={playlist} />
      <MusicStripEmbed playlist={playlist} />
    </aside>
  );
}
