"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { content } from "@/content";
import { commands, find, parse } from "@/lib/commands";
import {
  getServerTheme,
  getTheme,
  setTheme,
  subscribeTheme,
} from "@/lib/theme-store";
import { isTheme, THEME_NAMES } from "@/lib/themes";

export type LogLine = {
  id: number;
  kind: "cmd" | "out" | "err";
  text: string;
};

type Terminal = {
  log: readonly LogLine[];
  history: readonly string[];
  run: (input: string) => void;
  print: (lines: readonly string[]) => void;
};

const TerminalContext = createContext<Terminal | null>(null);

export function useTerminal(): Terminal {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error("useTerminal must be used inside TerminalProvider");
  return ctx;
}

const HIGHLIGHT_MS = 1600;

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.setAttribute("data-highlight", "true");
  window.setTimeout(() => el.removeAttribute("data-highlight"), HIGHLIGHT_MS);
}

function downloadCv() {
  const a = document.createElement("a");
  a.href = content.cv.href;
  a.download = content.cv.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [log, setLog] = useState<LogLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const nextId = useRef(0);
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  const append = useCallback((entries: Omit<LogLine, "id">[]) => {
    setLog((prev) => [
      ...prev,
      ...entries.map((e) => ({ ...e, id: nextId.current++ })),
    ]);
  }, []);

  const print = useCallback(
    (lines: readonly string[]) =>
      append(lines.map((text) => ({ kind: "out" as const, text }))),
    [append],
  );

  const run = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;
      setHistory((prev) => [...prev, trimmed]);
      const { name, args } = parse(trimmed);
      const command = find(name);
      const echo = { kind: "cmd" as const, text: trimmed };

      if (!command) {
        append([
          echo,
          { kind: "err", text: `E492: Not an editor command: ${trimmed}` },
          { kind: "out", text: "Try /help for a list of commands." },
        ]);
        return;
      }

      switch (command.name) {
        case "/clear":
          setLog([]);
          return;
        case "/help":
          append([
            echo,
            { kind: "out", text: "Available commands:" },
            ...commands.map((c) => ({
              kind: "out" as const,
              text: `  ${[c.name, ...(c.aliases ?? [])].join(", ").padEnd(22)} ${c.description}`,
            })),
          ]);
          return;
        case ":w":
          downloadCv();
          append([echo, { kind: "out", text: `"${content.cv.filename}" written (CV download started)` }]);
          return;
        case ":q":
          append([
            echo,
            {
              kind: "err",
              text: "E37: No write since last change. This buffer is read-only and the page isn't going anywhere — try :w instead.",
            },
          ]);
          return;
        case ":theme": {
          const wanted = args[0];
          const valid = THEME_NAMES.join(" | ");
          if (!wanted) {
            append([
              echo,
              { kind: "out", text: `themes: ${valid}` },
              { kind: "out", text: `active: ${theme}` },
            ]);
          } else if (isTheme(wanted)) {
            setTheme(wanted);
            append([echo, { kind: "out", text: `Theme set to ${wanted}` }]);
          } else {
            append([
              echo,
              { kind: "err", text: `E474: Unknown theme: ${wanted}` },
              { kind: "out", text: `Valid themes: ${valid}` },
            ]);
          }
          return;
        }
      }

      if (command.target) {
        scrollToSection(command.target);
        append([echo, { kind: "out", text: command.result ?? `Opened ${command.name}` }]);
      }
    },
    [append, theme],
  );

  return (
    <TerminalContext value={{ log, history, run, print }}>
      {children}
    </TerminalContext>
  );
}
