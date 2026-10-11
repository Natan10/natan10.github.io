"use client";

import { chipCommands } from "@/lib/commands";
import { useTerminal } from "./terminal-provider";

function chipCaption(texts: object): string {
  return "chip" in texts && typeof texts.chip === "string" ? texts.chip : "";
}

export function MacroChips() {
  const { run, dict } = useTerminal();
  return chipCommands.map((c) => (
    <button
      key={c.name}
      type="button"
      onClick={() => run(c.aliases?.find((a) => a.startsWith("/")) ?? c.name)}
      className={
        c.chip?.danger
          ? "group min-h-11 md:min-h-0 px-space-sm py-space-xs bg-surface-container-high hover:bg-error-container text-label-md flex items-center gap-1 border border-outline-variant"
          : "group min-h-11 md:min-h-0 px-space-sm py-space-xs bg-surface-container hover:bg-surface-container-high text-label-md flex items-center gap-1 border border-outline-variant"
      }
    >
      <span
        className={
          c.chip?.danger
            ? "text-error group-hover:text-on-error-container"
            : "text-secondary"
        }
      >
        [{c.aliases?.find((a) => a.startsWith("/")) ?? c.name}]
      </span>
      <span className="text-on-surface-variant group-hover:text-on-surface">
        {chipCaption(dict.commands[c.name])}
      </span>
    </button>
  ));
}
