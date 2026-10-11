// Type-level tests: each `@ts-expect-error` must sit on a line TypeScript
// rejects. If the language types ever stop requiring an entry, the directive
// becomes unused and `tsc` (and `next build`) fail.
import type { ContentText } from "@/content/text";
import type { Dictionary } from "@/lib/dictionary";

type Without<T, K extends keyof T> = Omit<T, K>;

// A translatable profile field.
// @ts-expect-error missing profile text
export const noProfile: ContentText = {} as Without<ContentText, "profile">;

// One experience entry, one project, one takeaway, one skill group.
// @ts-expect-error missing experience entry
export const noEntry: ContentText["experience"] = {} as Without<ContentText["experience"], "lumi">;
// @ts-expect-error missing project description
export const noProject: ContentText["projects"] = {} as Without<ContentText["projects"], "observability">;
// @ts-expect-error missing takeaway
export const noTakeaway: ContentText["takeaways"] = {} as Without<ContentText["takeaways"], "pipeline">;
// @ts-expect-error missing skill group heading
export const noGroup: ContentText["skillGroups"] = {} as Without<ContentText["skillGroups"], "ai">;

// A dictionary section and a whole command.
// @ts-expect-error missing dictionary section
export const noHero: Dictionary = {} as Without<Dictionary, "hero">;
// @ts-expect-error missing command texts
export const noCommand: Dictionary["commands"] = {} as Without<Dictionary["commands"], "/skills">;

// A section command needs its result line; a chip command needs its caption.
// @ts-expect-error section command without a result
export const noResult: Dictionary["commands"]["/skills"] = {} as Without<Dictionary["commands"]["/skills"], "result">;
// @ts-expect-error chip command without a caption
export const noChip: Dictionary["commands"]["/help"] = {} as Without<Dictionary["commands"]["/help"], "chip">;

// The Spotify playlist link label is required in every dictionary.
// @ts-expect-error missing playlist link label
export const noPlaylistLabel: Dictionary["sections"] = {} as Without<Dictionary["sections"], "spotifyPlaylist">;

// The music player's texts: the output lines, and the command's description and chip caption.
// @ts-expect-error missing music player text
export const noMusicText: Dictionary["music"] = {} as Without<Dictionary["music"], "alreadyOpen">;
// @ts-expect-error music command without a chip caption
export const noMusicChip: Dictionary["commands"]["/music"] = {} as Without<Dictionary["commands"]["/music"], "chip">;
