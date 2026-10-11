"use client";

import type { ReactNode } from "react";
import { useTerminal } from "./terminal-provider";

/**
 * The page's main landmark. While the music strip (108px) is open the bottom
 * padding grows to strip + statusline (32px) so the last line stays reachable.
 */
export function PageBody({ children }: { children: ReactNode }) {
  const { musicOpen } = useTerminal();
  return (
    <main
      className={`w-full bg-background min-h-screen ${musicOpen ? "pb-[140px]" : "pb-12"}`}
    >
      {children}
    </main>
  );
}
