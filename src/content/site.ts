import { shared } from "./shared";

// Site-wide values that do not change with the language. The description is
// per language and lives in the dictionary.
export const site = {
  name: shared.profile.name,
  bannerWord: "NATAN",
  title: shared.profile.title,
  version: "v0.1.0",
} as const;
