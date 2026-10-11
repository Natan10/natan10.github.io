"use client";

import { MusicStripEmbed } from "./music-strip-embed";
import { MusicStripHeader } from "./music-strip-header";
import { useTerminal } from "./terminal-provider";

/**
 * The player strip above the statusline; rendered only while it is open.
 * Always `music-strip` (108px) tall including its 1px top border: the embed
 * takes `music-embed` (80px) and the header row fills the rest (27px plus its
 * own bottom border). The sizes live in globals.css.
 */
export function MusicStrip() {
  const { musicOpen, dict } = useTerminal();
  if (!musicOpen) return null;
  return (
    <aside
      aria-label={dict.music.landmark}
      className="fixed bottom-statusline left-0 right-0 z-40 box-border h-music-strip flex flex-col bg-surface-container-low border-t border-primary md:left-auto md:right-margin md:w-[480px] md:border md:border-b-0 md:shadow-flat-up"
    >
      <MusicStripHeader />
      <MusicStripEmbed />
    </aside>
  );
}
