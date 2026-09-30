"use client";

import { useEffect, useRef, useState } from "react";
import { isEditable } from "@/lib/keyboard";

const LINE_HEIGHT = 22;
const SCROLL_STEP = 66;
const CHORD_MS = 600;

type Position = { line: number; percent: number };

function readPosition(): Position {
  const el = document.documentElement;
  const max = el.scrollHeight - el.clientHeight;
  return {
    line: Math.floor(window.scrollY / LINE_HEIGHT) + 1,
    percent: max > 0 ? Math.round((window.scrollY / max) * 100) : 0,
  };
}

export function Statusline() {
  const [command, setCommand] = useState(false);
  const [pos, setPos] = useState<Position>({ line: 1, percent: 0 });
  const lastG = useRef(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setPos(readPosition()));
    };
    const onFocus = () =>
      setCommand(document.activeElement?.id === "command-prompt");

    // j/k/gg/G scroll like Vim's normal mode, but never while typing.
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || isEditable(e.target)) return;
      if (e.key === "j" || e.key === "k") {
        window.scrollBy({
          top: e.key === "j" ? SCROLL_STEP : -SCROLL_STEP,
          behavior: "instant",
        });
      } else if (e.key === "G") {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "instant",
        });
      } else if (e.key === "g") {
        if (e.timeStamp - lastG.current < CHORD_MS) {
          window.scrollTo({ top: 0, behavior: "instant" });
          lastG.current = 0;
        } else {
          lastG.current = e.timeStamp;
        }
      } else {
        lastG.current = 0;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onFocus);
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onFocus);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <footer
      aria-hidden="true"
      className="fixed bottom-0 left-0 right-0 z-50 h-8 bg-surface-container-lowest border-t border-outline-variant px-margin-mobile md:px-margin flex items-center justify-between gap-space-md text-label-md"
    >
      <div className="flex items-center gap-space-md min-w-0">
        <span
          data-testid="mode"
          className="px-space-sm bg-primary text-on-primary font-bold"
        >
          {command ? "COMMAND" : "NORMAL"}
        </span>
        <span className="md:hidden text-secondary truncate">profile.vim</span>
        <span className="hidden md:inline text-secondary truncate">⎇ main</span>
        <span className="hidden md:inline text-on-surface-variant">UTF-8</span>
        <span className="hidden md:inline text-primary-container">
          ✓ 0 errors 0 warnings
        </span>
      </div>
      <span data-testid="position" className="text-on-surface-variant shrink-0">
        {pos.line}:1 {pos.percent}%
      </span>
    </footer>
  );
}
