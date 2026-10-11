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
import type { Content } from "@/content/types";
import { commands, find, parse } from "@/lib/commands";
import type { Dictionary } from "@/lib/dictionary";
import {
  fill,
  isLanguage,
  LANGUAGE_INFO,
  LANGUAGES,
  type Language,
} from "@/lib/i18n";
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
  /** Whether the music player strip is open; the one source of truth. */
  musicOpen: boolean;
  /** The public playlist the player opens; shared so the strip needs no props. */
  playlist: Content["playlist"];
  /**
   * Closes the player strip (removing the embed) and prints the result. With
   * `restoreFocus` the prompt takes focus: a keyboard user who pressed `[x]`
   * would otherwise lose it when the button unmounts.
   */
  closeMusic: (options?: MusicOptions) => void;
  language: Language;
  dict: Dictionary;
};

type EchoLine = Omit<LogLine, "id">;

type MusicOptions = { echo?: EchoLine; restoreFocus?: boolean };

/** Id of the prompt input (see `Prompt`). */
const PROMPT_ID = "command-prompt";

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

function downloadCv(cv: Content["cv"]) {
  const a = document.createElement("a");
  a.href = cv.href;
  a.download = cv.filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function TerminalProvider({
  children,
  language,
  dict,
  cv,
  playlist,
}: {
  children: ReactNode;
  language: Language;
  dict: Dictionary;
  cv: Content["cv"];
  playlist: Content["playlist"];
}) {
  const [log, setLog] = useState<LogLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [musicOpen, setMusicOpen] = useState(false);
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

  // The single place the player opens and closes; `echo` is the typed command.
  const openMusic = useCallback(
    (echo?: EchoLine) => {
      const m = dict.music;
      if (musicOpen) {
        append([...(echo ? [echo] : []), { kind: "out", text: m.alreadyOpen }]);
        return;
      }
      setMusicOpen(true);
      append([
        ...(echo ? [echo] : []),
        { kind: "out", text: fill(m.opened, { url: playlist.url, name: playlist.name }) },
      ]);
    },
    [append, dict, musicOpen, playlist],
  );

  const closeMusic = useCallback(
    ({ echo, restoreFocus }: MusicOptions = {}) => {
      const m = dict.music;
      setMusicOpen(false);
      append([
        ...(echo ? [echo] : []),
        { kind: "out", text: musicOpen ? m.closed : m.notOpen },
      ]);
      if (restoreFocus) document.getElementById(PROMPT_ID)?.focus();
    },
    [append, dict, musicOpen],
  );

  const run = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;
      setHistory((prev) => [...prev, trimmed]);
      const { name, args, rawArgs } = parse(trimmed);
      const command = find(name);
      const echo = { kind: "cmd" as const, text: trimmed };
      const t = dict.terminal;

      if (!command) {
        append([
          echo,
          { kind: "err", text: fill(t.unknownCommand, { input: trimmed }) },
          { kind: "out", text: t.unknownHint },
        ]);
        return;
      }

      const texts = dict.commands[command.name];

      switch (command.name) {
        case "/clear":
          setLog([]);
          return;
        case "/help":
          append([
            echo,
            { kind: "out", text: t.helpHeading },
            ...commands.map((c) => ({
              kind: "out" as const,
              text: `  ${[c.name, ...(c.aliases ?? [])].join(", ").padEnd(22)} ${dict.commands[c.name].description}`,
            })),
          ]);
          return;
        case ":w":
          downloadCv(cv);
          append([echo, { kind: "out", text: fill(t.cvWritten, { file: cv.filename }) }]);
          return;
        case ":q":
          append([echo, { kind: "err", text: t.quit }]);
          return;
        case "/music": {
          const m = dict.music;
          const arg = args[0];
          if (arg === undefined) {
            openMusic(echo);
          } else if (arg === "off" && args.length === 1) {
            closeMusic({ echo });
          } else {
            // Name the offending token as typed: the first argument, unless it
            // is a valid "off" followed by something extra.
            const offending = arg === "off" ? rawArgs[1] : rawArgs[0];
            append([
              echo,
              { kind: "err", text: fill(m.unknownArgument, { arg: offending }) },
              { kind: "out", text: m.usage },
            ]);
          }
          return;
        }
        case ":theme": {
          const wanted = args[0];
          const valid = THEME_NAMES.join(" | ");
          if (!wanted) {
            append([
              echo,
              { kind: "out", text: fill(t.themes, { themes: valid }) },
              { kind: "out", text: fill(t.themeActive, { theme }) },
            ]);
          } else if (isTheme(wanted)) {
            setTheme(wanted);
            append([echo, { kind: "out", text: fill(t.themeSet, { theme: wanted }) }]);
          } else {
            append([
              echo,
              { kind: "err", text: fill(t.unknownTheme, { name: wanted }) },
              { kind: "out", text: fill(t.validThemes, { themes: valid }) },
            ]);
          }
          return;
        }
        case "/language": {
          const wanted = args[0];
          const valid = LANGUAGES.join(" | ");
          if (!wanted) {
            append([
              echo,
              { kind: "out", text: fill(t.languages, { languages: valid }) },
              { kind: "out", text: fill(t.languageActive, { language }) },
            ]);
          } else if (!isLanguage(wanted)) {
            append([
              echo,
              { kind: "err", text: fill(t.unknownLanguage, { name: wanted }) },
              { kind: "out", text: fill(t.validLanguages, { languages: valid }) },
            ]);
          } else if (wanted === language) {
            append([
              echo,
              {
                kind: "out",
                text: fill(t.languageAlready, { language: LANGUAGE_INFO[wanted].name }),
              },
            ]);
          } else {
            window.location.assign(LANGUAGE_INFO[wanted].path);
          }
          return;
        }
      }

      if (command.target && "result" in texts) {
        scrollToSection(command.target);
        append([echo, { kind: "out", text: texts.result }]);
      }
    },
    [append, theme, language, dict, cv, openMusic, closeMusic],
  );

  return (
    <TerminalContext
      value={{
        log,
        history,
        run,
        print,
        musicOpen,
        playlist,
        closeMusic,
        language,
        dict,
      }}
    >
      {children}
    </TerminalContext>
  );
}
