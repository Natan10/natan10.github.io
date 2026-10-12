import type { Metadata } from "next";
import { site } from "@/content/site";
import { getDictionary } from "./dictionaries";
import { LANGUAGE_INFO, LANGUAGES, type Language } from "./i18n";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://natan10.github.io";

const title = `${site.name} — ${site.title}`;

/** Each language is its own canonical address and lists the others as alternates. */
export function buildMetadata(language: Language): Metadata {
  const description = getDictionary(language).site.description;
  const socialImage = `${LANGUAGE_INFO[language].path === "/" ? "" : LANGUAGE_INFO[language].path}/opengraph-image.png`;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: LANGUAGE_INFO[language].path,
      languages: Object.fromEntries(
        LANGUAGES.map((l) => [LANGUAGE_INFO[l].htmlLang, LANGUAGE_INFO[l].path]),
      ),
    },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: site.name,
      images: [{ url: socialImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [socialImage] },
  };
}
