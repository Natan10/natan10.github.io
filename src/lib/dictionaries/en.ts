import type { Dictionary } from "../dictionary";

export const en: Dictionary = {
  site: {
    description:
      "Personal portfolio of Natan Moreira, software engineer: experience, skills, projects and key takeaways.",
  },
  hero: {
    hardware: "VT220-COMPATIBLE HARDWARE TERMINAL [80x25 EMULATION]",
    ready: "TTY1 READY",
    intro: {
      before:
        "Modal workspace session initialized. Execute commands starting with ",
      or: " or ",
      after: ", or trigger quick buffers from the macro registers below.",
    },
    macroRegisters: "Macro Registers:",
  },
  language: { navLabel: "Language" },
  boot: {
    regionLabel: "Session boot log",
    sessionBoot: "[SESSION BOOT: 0.0014s]",
    system:
      "[SYSTEM]: Kernel v6.8.9-x86_64 loaded. Guest privilege session established.",
    help: {
      before: "Type ",
      after:
        " or press any macro chip above to render systems buffer. All commands are non-destructive in guest session mode.",
    },
  },
  prompt: { label: "Command", exec: "EXEC", clear: "CLEAR" },
  output: { label: "Command output" },
  statusline: { diagnostics: "✓ 0 errors 0 warnings" },
  sections: {
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    takeaways: "Key takeaways",
    contact: "Contact",
    stack: "Stack",
    tags: "Tags",
    location: "location",
    status: "status",
    photoPlaceholder: "TODO: owner photo",
    downloadCv: "Download CV ({file})",
    frameCounts: "{lines} lines, {bytes} bytes",
  },
  terminal: {
    helpHeading: "Available commands:",
    cvWritten: '"{file}" written (CV download started)',
    quit: "E37: No write since last change. This buffer is read-only and the page isn't going anywhere — try :w instead.",
    themes: "themes: {themes}",
    themeActive: "active: {theme}",
    themeSet: "Theme set to {theme}",
    unknownTheme: "E474: Unknown theme: {name}",
    validThemes: "Valid themes: {themes}",
    unknownCommand: "E492: Not an editor command: {input}",
    unknownHint: "Try /help for a list of commands.",
    languages: "languages: {languages}",
    languageActive: "active: {language}",
    unknownLanguage: "E474: Unknown language: {name}",
    validLanguages: "Valid languages: {languages}",
    languageAlready: "Already using {language}",
    kinds: { section: "section", action: "action", system: "system" },
  },
  commands: {
    "/user": {
      description: "Show the identity summary",
      result: "Opened identity → ~/.terminal/user.json",
      chip: "identity",
    },
    "/experience": {
      description: "Show the experience timeline",
      result: "Opened experience timeline → ~/.terminal/experience.log",
      chip: "history",
    },
    "/skills": {
      description: "Show the skills matrix",
      result: "Opened skills matrix → ~/.terminal/skills.json",
      chip: "matrix",
    },
    "/projects": {
      description: "Show selected projects",
      result: "Opened projects → ~/.terminal/projects.md",
      chip: "crates",
    },
    "/contact": {
      description: "Show contact links and the CV",
      result: "Opened contact → ~/.terminal/contact.txt",
    },
    "/takeaways": {
      description: "Show key takeaways",
      result: "Opened takeaways → ~/.terminal/takeaways.md",
    },
    ":theme": {
      description: "List or switch colour themes (:theme [name])",
      chip: "palette",
    },
    "/language": {
      description: "List or switch the language (/language [en|pt])",
    },
    "/help": { description: "List every available command", chip: "manpage" },
    "/clear": {
      description: "Reset the output to the boot card",
      chip: "reset",
    },
    ":w": { description: "Download the CV" },
    ":q": { description: "Try to quit (good luck)" },
  },
};
