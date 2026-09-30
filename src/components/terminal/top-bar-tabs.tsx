"use client";

import { tabCommands } from "@/lib/commands";
import { useTerminal } from "./terminal-provider";

export function TopBarTabs() {
  const { run } = useTerminal();
  return (
    <nav
      aria-label="Buffers"
      className="order-last md:order-none w-full md:w-auto flex items-center gap-space-xs md:gap-space-sm overflow-x-auto text-label-md border-t border-outline-variant md:border-t-0"
    >
      {tabCommands.map((c, i) => (
        <button
          key={c.name}
          type="button"
          onClick={() => run(c.name)}
          aria-current={i === 0 ? "page" : undefined}
          className={
            i === 0
              ? "shrink-0 whitespace-nowrap min-h-11 md:min-h-0 px-space-sm py-space-xs bg-surface-container-high text-primary font-bold"
              : "shrink-0 whitespace-nowrap min-h-11 md:min-h-0 px-space-sm py-space-xs text-on-surface-variant hover:text-on-surface"
          }
        >
          {c.tab}
        </button>
      ))}
    </nav>
  );
}
