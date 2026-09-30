"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { isEditable } from "@/lib/keyboard";
import { commonPrefix, suggest } from "@/lib/commands";
import { useTerminal } from "./terminal-provider";

export function Prompt() {
  const { run, history, print } = useTerminal();
  const [value, setValue] = useState("");
  // Position while walking history; history.length means "the draft".
  const [cursor, setCursor] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);

  // Vim-style entry: "/" or ":" anywhere on the page focuses the prompt with
  // that character prefilled. Ignored while typing in any editable element.
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key !== "/" && e.key !== ":") return;
      if (e.ctrlKey || e.metaKey || e.altKey || isEditable(e.target)) return;
      e.preventDefault();
      setValue(e.key);
      setCursor(null);
      input.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submit() {
    if (!value.trim()) return;
    run(value);
    setValue("");
    setCursor(null);
    input.current?.focus();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      input.current?.blur();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (!history.length) return;
      e.preventDefault();
      const from = cursor ?? history.length;
      const next = Math.min(
        history.length,
        Math.max(0, from + (e.key === "ArrowUp" ? -1 : 1)),
      );
      setCursor(next === history.length ? null : next);
      setValue(next === history.length ? "" : history[next]);
    } else if (e.key === "Tab" && value.trim()) {
      e.preventDefault();
      const matches = suggest(value);
      if (!matches.length) return;
      const completed = commonPrefix(matches.map((m) => m.text));
      setValue(matches.length === 1 ? `${completed} ` : completed);
      if (matches.length > 1) {
        print([matches.map((m) => `${m.text} (${m.kind})`).join("   ")]);
      }
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-center gap-space-sm px-space-md py-space-sm border-b border-outline-variant bg-surface-container-low"
    >
      <label
        htmlFor="command-prompt"
        className="text-primary font-bold text-label-md shrink-0"
      >
        <span aria-hidden="true">❯</span>
        <span className="sr-only">Command</span>
      </label>
      <input
        id="command-prompt"
        ref={input}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setCursor(null);
        }}
        onKeyDown={onKeyDown}
        type="text"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        placeholder="/help"
        className="min-w-0 flex-1 bg-transparent text-body-md text-on-surface placeholder:text-outline focus-visible:outline-2 focus-visible:outline-primary"
      />
      <button
        type="submit"
        className="px-space-sm py-space-xs bg-primary text-on-primary text-label-md font-bold"
      >
        EXEC
      </button>
      <button
        type="button"
        onClick={() => run("/clear")}
        className="px-space-sm py-space-xs bg-surface-container-high text-error text-label-md border border-outline-variant"
      >
        CLEAR
      </button>
    </form>
  );
}
