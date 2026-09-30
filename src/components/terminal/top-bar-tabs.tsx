"use client";

import { tabCommands } from "@/lib/commands";
import { useTerminal } from "./terminal-provider";

export function TopBarTabs() {
  const { run } = useTerminal();
  return (
    <nav
      aria-label="Buffers"
      className="hidden md:flex items-center gap-space-sm text-label-md"
    >
      {tabCommands.map((c, i) => (
        <button
          key={c.name}
          type="button"
          onClick={() => run(c.name)}
          aria-current={i === 0 ? "page" : undefined}
          className={
            i === 0
              ? "px-space-sm py-space-xs bg-surface-container-high text-primary font-bold"
              : "px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface"
          }
        >
          {c.tab}
        </button>
      ))}
    </nav>
  );
}
