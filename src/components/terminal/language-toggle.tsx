"use client";

import { LANGUAGE_INFO, LANGUAGES, type Language } from "@/lib/i18n";

const ITEM =
  "min-h-11 md:min-h-0 px-space-sm py-space-xs flex items-center text-label-md border border-outline-variant";

/**
 * EN | PT toggle. The other language is a plain link to its route, so it works
 * with or without JavaScript. The other page opens at its top.
 */
export function LanguageToggle({
  current,
  label,
}: {
  current: Language;
  label: string;
}) {
  return (
    <nav aria-label={label} className="sm:ml-auto">
      <ul className="flex items-center gap-space-xs">
        {LANGUAGES.map((language) => {
          const info = LANGUAGE_INFO[language];
          return (
            <li key={language}>
              {language === current ? (
                <span
                  aria-current="true"
                  className={`${ITEM} bg-primary text-on-primary font-bold`}
                >
                  {info.label}
                </span>
              ) : (
                <a
                  href={info.path}
                  lang={info.htmlLang}
                  aria-label={info.name}
                  className={`${ITEM} bg-surface-container hover:bg-surface-container-high text-secondary focus-visible:outline-2 focus-visible:outline-primary`}
                >
                  {info.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
