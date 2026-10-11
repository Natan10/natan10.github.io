"use client";

import type { Content } from "@/content/types";
import { useTerminal } from "./terminal-provider";

/**
 * The embed area (80px). The iframe only exists while this component is
 * mounted, so closing the strip removes it and stops playback. The container
 * colour is Spotify's own dark embed background.
 */
export function MusicStripEmbed({ playlist }: { playlist: Content["playlist"] }) {
  const { dict } = useTerminal();
  return (
    <div className="h-20 relative bg-[#1f1f1f]">
      <iframe
        src={playlist.embedUrl}
        title={dict.music.iframeTitle}
        allow="encrypted-media"
        loading="lazy"
        className="block w-full h-20 border-0 [color-scheme:light]"
      />
    </div>
  );
}
