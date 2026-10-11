"use client";

import { useEffect, useState } from "react";
import type { Content } from "@/content/types";
import { useTerminal } from "./terminal-provider";

/** Iframe error events are unreliable, so a load that never arrives counts as a failure. */
const LOAD_TIMEOUT_MS = 8000;

type EmbedStatus = "loading" | "ready" | "failed";

/**
 * The embed area (80px). The iframe only exists while this component is
 * mounted, so closing the strip removes it and stops playback. The container
 * colour is Spotify's own dark embed background. If the embed never loads
 * (blocked, offline, CSP) an error message takes the iframe's place.
 */
export function MusicStripEmbed({ playlist }: { playlist: Content["playlist"] }) {
  const { dict } = useTerminal();
  const [status, setStatus] = useState<EmbedStatus>("loading");

  useEffect(() => {
    const timer = setTimeout(
      () => setStatus((s) => (s === "loading" ? "failed" : s)),
      LOAD_TIMEOUT_MS,
    );
    // A blocked or offline iframe still fires `load` (with the browser's error
    // page) and its content is cross-origin, so the load signal cannot tell the
    // two apart. A no-cors request to the same URL rejects only when the
    // network or a blocker refuses it, and resolves (opaque) otherwise.
    const probe = new AbortController();
    fetch(playlist.embedUrl, { mode: "no-cors", signal: probe.signal }).catch(() => {
      if (!probe.signal.aborted) setStatus("failed");
    });
    return () => {
      clearTimeout(timer);
      probe.abort();
    };
  }, [playlist.embedUrl]);

  return (
    <div className="h-20 relative bg-[#1f1f1f]">
      {status === "failed" ? (
        <p role="status" className="h-20 flex items-center px-space-sm text-label-md text-error">
          {dict.music.embedError}
        </p>
      ) : (
        <iframe
          src={playlist.embedUrl}
          title={dict.music.iframeTitle}
          allow="encrypted-media"
          loading="lazy"
          onLoad={() => setStatus((s) => (s === "loading" ? "ready" : s))}
          onError={() => setStatus("failed")}
          className="block w-full h-20 border-0 [color-scheme:light]"
        />
      )}
    </div>
  );
}
