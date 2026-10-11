import type { Dictionary } from "../dictionary";
import type { Language } from "../i18n";
import { en } from "./en";
import { pt } from "./pt";

const dictionaries: Record<Language, Dictionary> = { en, pt };

export function getDictionary(language: Language): Dictionary {
  return dictionaries[language];
}
