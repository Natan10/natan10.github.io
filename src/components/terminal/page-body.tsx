"use client";

import type { ReactNode } from "react";
import { useTerminal } from "./terminal-provider";

/**
 * The page's main landmark. While the music strip is open the bottom padding
 * grows to strip + statusline so the last line stays reachable.
 */
export function PageBody({ children }: { children: ReactNode }) {
  const { musicOpen } = useTerminal();
  return (
    <main
      className={`w-full bg-background min-h-screen ${musicOpen ? "pb-[calc(var(--spacing-music-strip)+var(--spacing-statusline))]" : "pb-12"}`}
    >
      {children}
    </main>
  );
}
