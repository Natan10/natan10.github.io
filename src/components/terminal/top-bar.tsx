import { tabs } from "@/content/site";

export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest border-b border-outline-variant">
      <div className="h-16 w-full px-margin-mobile md:px-margin flex items-center justify-between">
        <div className="flex items-center gap-space-md min-w-0">
          <div aria-hidden="true" className="flex items-center gap-space-xs">
            <span className="w-3 h-3 bg-error inline-block" />
            <span className="w-3 h-3 bg-primary-container inline-block" />
            <span className="w-3 h-3 bg-secondary inline-block" />
          </div>
          <div className="flex items-center gap-space-xs text-label-md text-on-surface-variant truncate">
            <span className="text-primary font-bold">guest@terminal:</span>
            <span className="text-outline">~</span>
            <span className="text-on-surface">(tty1)</span>
          </div>
        </div>

        <nav
          aria-label="Buffers"
          className="hidden md:flex items-center gap-space-sm text-label-md"
        >
          {tabs.map((tab, i) => (
            <span
              key={tab}
              aria-current={i === 0 ? "page" : undefined}
              className={
                i === 0
                  ? "px-space-sm py-space-xs bg-surface-container-high text-primary font-bold"
                  : "px-space-sm py-space-xs text-on-surface-variant"
              }
            >
              {tab}
            </span>
          ))}
        </nav>

        <div
          aria-hidden="true"
          className="flex items-center gap-space-md text-label-sm"
        >
          <div className="hidden sm:flex items-center gap-space-sm text-on-surface-variant">
            <span className="text-secondary">LATENCY: 14ms</span>
            <span className="text-outline">|</span>
            <span className="text-primary">PORT: 443</span>
          </div>
          <div className="w-8 h-8 bg-primary text-on-primary flex items-center justify-center text-label-lg">
            @
          </div>
        </div>
      </div>
    </header>
  );
}
