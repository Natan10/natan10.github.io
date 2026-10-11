"use client";

import type { Content } from "@/content/types";
import { useTerminal } from "./terminal-provider";

/** The strip's own header row: it works even if the embed never loads. */
export function MusicStripHeader({ playlist }: { playlist: Content["playlist"] }) {
  const { dict, closeMusic } = useTerminal();
  return (
    <header className="h-7 flex items-center gap-space-sm px-space-sm text-label-md bg-surface-container-high border-b border-outline-variant">
      <span className="flex-1 min-w-0 truncate text-tertiary">♪ Natan Profile</span>
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
        onClick={closeMusic}
        className="min-w-7 min-h-5 px-1.5 font-bold text-error border border-outline-variant hover:bg-surface-container"
      >
        [x]
      </button>
    </header>
  );
}
