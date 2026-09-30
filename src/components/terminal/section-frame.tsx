import type { ReactNode } from "react";
import { measure, statusTag } from "@/lib/section-text";

type Props = {
  id: string;
  command: string;
  file: string;
  /** Plain-text lines of the section; drives the footer counters and tag. */
  lines: readonly string[];
  children: ReactNode;
};

export function SectionFrame({ id, command, file, lines, children }: Props) {
  const { lines: l, bytes } = measure(lines);
  const tag = statusTag(lines);
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border border-outline-variant bg-surface-container-lowest scroll-mt-20"
    >
      <div
        className="px-space-md py-space-xs flex items-center justify-between gap-space-sm text-label-md text-secondary"
      >
        <span aria-hidden="true">┌── [CMD: {command}] ──┐</span>
        <span id={`${id}-title`} className="text-outline truncate">
          {file}
        </span>
      </div>
      <div className="p-space-md">{children}</div>
      <div className="px-space-md py-space-xs flex items-center justify-between gap-space-sm text-label-md text-outline">
        <span aria-hidden="true">
          └── {l}L, {bytes}B ──┘
        </span>
        <span className="sr-only">
          {l} lines, {bytes} bytes
        </span>
        <span className={tag === "TODO" ? "text-error" : "text-primary"}>
          [{tag}]
        </span>
      </div>
    </section>
  );
}
