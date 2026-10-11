import type { CommandKind, CommandTexts } from "./commands";

/**
 * Every piece of interface text that is not personal content. English is the
 * source and Portuguese must satisfy the same type, so a missing entry is a
 * type error. Values are plain strings with `{name}` placeholders because the
 * dictionary crosses the server-to-client boundary.
 */
export type Dictionary = {
  site: { description: string };
  hero: {
    hardware: string;
    ready: string;
    intro: { before: string; or: string; after: string };
    macroRegisters: string;
  };
  language: { navLabel: string };
  boot: {
    regionLabel: string;
    sessionBoot: string;
    system: string;
    help: { before: string; after: string };
  };
  prompt: { label: string; exec: string; clear: string };
  output: { label: string };
  statusline: { diagnostics: string };
  sections: {
    experience: string;
    skills: string;
    projects: string;
    takeaways: string;
    contact: string;
    stack: string;
    tags: string;
    location: string;
    status: string;
    photoPlaceholder: string;
    downloadCv: string;
    spotifyPlaylist: string;
    frameCounts: string;
  };
  terminal: {
    helpHeading: string;
    cvWritten: string;
    quit: string;
    themes: string;
    themeActive: string;
    themeSet: string;
    unknownTheme: string;
    validThemes: string;
    unknownCommand: string;
    unknownHint: string;
    languages: string;
    languageActive: string;
    unknownLanguage: string;
    validLanguages: string;
    languageAlready: string;
    /** Kind words printed beside Tab suggestions, e.g. `/user (section)`. */
    kinds: Record<CommandKind, string>;
  };
  /**
   * The `/music` command's output lines and the player strip's labels. `opened`
   * and `iframeTitle` take `{name}` (the playlist's name, from the content).
   */
  music: {
    opened: string;
    alreadyOpen: string;
    closed: string;
    notOpen: string;
    unknownArgument: string;
    usage: string;
    openLink: string;
    closeName: string;
    iframeTitle: string;
    landmark: string;
    /** Shown in place of the embed when Spotify cannot be reached. */
    embedError: string;
  };
  commands: CommandTexts;
};
