import { asciiBanner } from "@/lib/ascii";
import { site } from "@/content/site";
import type { Dictionary } from "@/lib/dictionary";
import type { Language } from "@/lib/i18n";
import { LanguageToggle } from "./language-toggle";
import { MacroChips } from "./macro-chips";

export function Hero({
  dict,
  language,
}: {
  dict: Dictionary;
  language: Language;
}) {
  return (
    <header className="w-full pt-space-md pb-space-lg flex flex-col gap-space-sm">
      <div
        aria-hidden="true"
        className="flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant text-label-sm"
      >
        <span className="text-secondary flex items-center gap-1">
          <span className="inline-block w-2 h-2 bg-secondary animate-pulse" />
          {dict.hero.hardware}
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
              {site.version} — {dict.hero.ready}
            </span>
          </p>
          <p className="text-body-md text-on-surface-variant max-w-3xl">
            {dict.hero.intro.before}
            <span className="text-primary font-bold">/</span>
            {dict.hero.intro.or}
            <span className="text-secondary font-bold">:</span>
            {dict.hero.intro.after}
          </p>
        </div>

        <div className="mt-space-md pt-space-sm w-full flex flex-wrap items-center gap-space-xs">
          <span className="text-label-sm text-outline mr-space-xs uppercase">
            {dict.hero.macroRegisters}
          </span>
          <MacroChips />
          <LanguageToggle
            current={language}
            label={dict.language.navLabel}
          />
        </div>
      </div>
    </header>
  );
}
