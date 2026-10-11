import type { ReactNode } from "react";
import { LANGUAGE_INFO, type Language } from "@/lib/i18n";
import { jetbrainsMono } from "@/lib/fonts";
import { themeInitScript } from "@/lib/themes";

/** The `<html>` element shared by both languages' root layouts. */
export function RootShell({
  language,
  children,
}: {
  language: Language;
  children: ReactNode;
}) {
  return (
    <html
      lang={LANGUAGE_INFO[language].htmlLang}
      className={`${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-head-element -- this is the root layout's <html>, not a page */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
