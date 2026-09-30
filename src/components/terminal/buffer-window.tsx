import { Identity } from "./identity";

export function BufferWindow() {
  return (
    <div className="w-full bg-surface-container-low border border-outline-variant flex flex-col">
      <div
        aria-hidden="true"
        className="w-full bg-surface-container-lowest px-space-md py-space-xs flex items-center justify-between gap-space-sm text-label-sm"
      >
        <div className="flex items-center gap-space-sm min-w-0 text-on-surface-variant">
          <span className="text-secondary font-bold">BUF #1:</span>
          <span className="text-primary font-bold truncate">
            ~/.terminal/profile.vim
          </span>
          <span className="text-primary-container">[RO]</span>
        </div>
        <div className="hidden sm:flex items-center gap-space-md text-on-surface-variant">
          <span className="text-secondary">UTF-8</span>
          <span className="bg-surface-container px-space-xs py-0.5 text-on-surface">
            VIM 9.1
          </span>
        </div>
      </div>

      <div
        id="terminal-screen"
        className="p-space-md sm:p-space-lg flex flex-col gap-space-lg min-h-[320px] text-body-md"
      >
        <section
          aria-label="Session boot log"
          className="flex flex-col gap-space-xs text-on-surface-variant bg-surface-container-lowest p-space-md border border-outline-variant"
        >
          <div className="flex items-center justify-between text-label-sm text-outline">
            <span>[SESSION BOOT: 0.0014s]</span>
            <span>NODE: node-01a.sfo3</span>
          </div>
          <p className="text-primary font-bold">
            [SYSTEM]: Kernel v6.8.9-x86_64 loaded. Guest privilege session
            established.
          </p>
          <p className="text-on-surface">
            Type <span className="text-secondary font-bold">/help</span> or
            press any macro chip above to render systems buffer. All commands
            are non-destructive in guest session mode.
          </p>
          <p className="flex items-center text-primary font-bold">
            <span aria-hidden="true">guest@portfolio:~$</span>
            <span
              aria-hidden="true"
              className="inline-block w-2.5 h-4 bg-primary ml-1 animate-blink"
            />
          </p>
        </section>
        <Identity />
      </div>
    </div>
  );
}
