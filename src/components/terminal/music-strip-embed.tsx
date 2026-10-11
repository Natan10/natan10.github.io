"use client";

import { useEffect, useState } from "react";
import { fill } from "@/lib/i18n";
import { useTerminal } from "./terminal-provider";

/** How long a silent embed may take before the error shows. */
const LOAD_TIMEOUT_MS = 8000;

/** What the reachability probe found; "blocked" is final. */
type Probe = "pending" | "ok" | "blocked";

/**
 * The embed area (`music-embed`, 80px). The iframe only exists while this
 * component is mounted, so closing the strip removes it and stops playback.
 * The container colour is Spotify's own dark embed background.
 *
 * Two kinds of failure show the error message in the embed's place:
 *  - blocked or offline: the probe is refused, or the iframe reports an error.
 *    Final, and the iframe is removed.
 *  - slow: nothing answered within the timeout. The iframe stays mounted but
 *    hidden, so a late answer still recovers and shows the embed.
 */
export function MusicStripEmbed() {
  const { dict, playlist } = useTerminal();
  const [loaded, setLoaded] = useState(false);
  const [probe, setProbe] = useState<Probe>("pending");
  const [frameError, setFrameError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS);
    // A blocked or offline iframe still fires `load` (with the browser's error
    // page) and its content is cross-origin, so the load signal alone cannot
    // tell the two apart. A no-cors request to the same URL rejects only when
    // the network or a blocker refuses it, and resolves (opaque) otherwise. It
    // is a HEAD, so the embed document is not downloaded a second time.
    const controller = new AbortController();
    fetch(playlist.embedUrl, { method: "HEAD", mode: "no-cors", signal: controller.signal })
      .then(() => setProbe("ok"))
      .catch(() => {
        if (!controller.signal.aborted) setProbe("blocked");
      });
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [playlist.embedUrl]);

  const blocked = probe === "blocked" || frameError;
  // `load` only counts once the probe agrees: it cannot clear a refusal.
  const ready = loaded && probe === "ok";
  const showError = blocked || (timedOut && !ready);

  return (
    <div className="h-music-embed relative bg-embed-surface">
      {/* Always mounted and empty until it fails, so the text arrives as a
          change to a live region and is announced. */}
      <p
        role="status"
        className="absolute inset-0 pointer-events-none flex items-center px-space-sm text-label-md text-error"
      >
        {showError ? dict.music.embedError : null}
      </p>
      {!blocked && (
        <iframe
          src={playlist.embedUrl}
          title={fill(dict.music.iframeTitle, { name: playlist.name })}
          allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFrameError(true)}
          className={`${showError ? "hidden" : "block"} w-full h-music-embed border-0 [color-scheme:light]`}
        />
      )}
    </div>
  );
}
