"use client";

import { chipCommands } from "@/lib/commands";
import { useTerminal } from "./terminal-provider";

export function MacroChips() {
  const { run } = useTerminal();
  return chipCommands.map((c) => (
    <button
      key={c.name}
      type="button"
      onClick={() => run(c.aliases?.find((a) => a.startsWith("/")) ?? c.name)}
      className={
        c.chip?.danger
          ? "group px-space-sm py-space-xs bg-surface-container-high hover:bg-error-container text-label-md flex items-center gap-1 border border-outline-variant"
          : "group px-space-sm py-space-xs bg-surface-container hover:bg-surface-container-high text-label-md flex items-center gap-1 border border-outline-variant"
      }
    >
      <span className={c.chip?.danger ? "text-error" : "text-secondary"}>
        [{c.aliases?.find((a) => a.startsWith("/")) ?? c.name}]
      </span>
      <span className="text-on-surface-variant group-hover:text-on-surface">
        {c.chip?.label}
      </span>
    </button>
  ));
}
