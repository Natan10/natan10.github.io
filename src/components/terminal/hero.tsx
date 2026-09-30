import { asciiBanner } from "@/lib/ascii";
import { chips, site } from "@/content/site";

export function Hero() {
  return (
    <header className="w-full pt-space-md pb-space-lg flex flex-col gap-space-sm">
      <div
        aria-hidden="true"
        className="flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant text-label-sm"
      >
        <span className="text-secondary flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-secondary animate-pulse" />
          VT220-COMPATIBLE HARDWARE TERMINAL [80x25 EMULATION]
        </span>
        <span className="text-outline">
          BAUD: 38400 | ARCH: x86_64-retro | TERM: xterm-256color
        </span>
      </div>

      <div className="w-full bg-surface-container-lowest border border-outline-variant p-space-md sm:p-space-lg flex flex-col items-start overflow-x-auto">
        <h1 className="sr-only">
          {site.name} — {site.title}
        </h1>
        <pre
          aria-hidden="true"
          className="text-[8px] leading-[1.32] sm:text-body-sm sm:leading-[1.32] [font-variant-ligatures:none] text-primary whitespace-pre select-none drop-shadow-[0_0_8px_rgba(196,210,126,0.35)]"
        >
          {asciiBanner(site.bannerWord)}
        </pre>

        <div className="mt-space-sm flex flex-col gap-space-xs">
          <p className="text-headline-md text-primary-fixed tracking-wide">
            {site.title.toUpperCase()}{" "}
            <span className="text-secondary text-label-md">
              {site.version} — TTY1 READY
            </span>
          </p>
          <p className="text-body-md text-on-surface-variant max-w-3xl">
            Modal workspace session initialized. Execute commands starting with{" "}
            <span className="text-primary font-bold">/</span> or{" "}
            <span className="text-secondary font-bold">:</span>, or trigger
            quick buffers from the macro registers below.
          </p>
        </div>

        <div className="mt-space-md pt-space-sm w-full flex flex-wrap items-center gap-space-xs">
          <span className="text-label-sm text-outline mr-space-xs uppercase">
            Macro Registers:
          </span>
          {chips.map((chip) => (
            <button
              key={chip.command}
              type="button"
              className={
                "danger" in chip
                  ? "group px-space-sm py-space-xs bg-surface-container-high hover:bg-error-container text-label-md flex items-center gap-1 border border-outline-variant"
                  : "group px-space-sm py-space-xs bg-surface-container hover:bg-surface-container-high text-label-md flex items-center gap-1 border border-outline-variant"
              }
            >
              <span
                className={"danger" in chip ? "text-error" : "text-secondary"}
              >
                [{chip.command}]
              </span>
              <span className="text-on-surface-variant group-hover:text-on-surface">
                {chip.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
