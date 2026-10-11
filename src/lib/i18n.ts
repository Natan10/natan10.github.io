export const LANGUAGES = ["en", "pt"] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

/** The route, page language attribute and display names of each language. */
export const LANGUAGE_INFO = {
  en: { path: "/", htmlLang: "en", name: "English", label: "EN" },
  pt: { path: "/pt", htmlLang: "pt-BR", name: "Português", label: "PT" },
} as const satisfies Record<
  Language,
  { path: string; htmlLang: string; name: string; label: string }
>;

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

/** Dictionary values are plain strings with `{name}` placeholders. */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
