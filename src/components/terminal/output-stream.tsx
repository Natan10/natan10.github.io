"use client";

import { useTerminal } from "./terminal-provider";

export function OutputStream() {
  const { log } = useTerminal();
  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Command output"
      className="flex flex-col text-body-md"
    >
      {log.map((line) => (
        <p
          key={line.id}
          aria-hidden={line.kind === "cmd" ? true : undefined}
          className={
            "whitespace-pre-wrap break-words " +
            (line.kind === "cmd"
              ? "text-primary font-bold"
              : line.kind === "err"
                ? "text-error"
                : "text-on-surface-variant")
          }
        >
          {line.kind === "cmd" ? `guest@portfolio:~$ ${line.text}` : line.text}
        </p>
      ))}
    </div>
  );
}
