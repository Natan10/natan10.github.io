"use client";

import { MUSIC_GLYPH } from "@/lib/music";
import { useTerminal } from "./terminal-provider";

/** The strip's own header row: it works even if the embed never loads. */
export function MusicStripHeader() {
  const { dict, playlist, closeMusic } = useTerminal();
  return (
    <header className="flex-1 min-h-0 flex items-center gap-space-sm px-space-sm text-label-md bg-surface-container-high border-b border-outline-variant">
      <span className="flex-1 min-w-0 truncate text-tertiary">
        {MUSIC_GLYPH} {playlist.name}
      </span>
      <a
        href={playlist.url}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap text-secondary"
      >
        {dict.music.openLink}
      </a>
      <button
        type="button"
        aria-label={dict.music.closeName}
        // `detail` is 0 for a click made with the keyboard (Enter or Space).
        onClick={(e) => closeMusic({ restoreFocus: e.detail === 0 })}
        className="min-w-7 min-h-5 px-1.5 font-bold text-error border border-outline-variant hover:bg-surface-container"
      >
        [x]
      </button>
    </header>
  );
}
