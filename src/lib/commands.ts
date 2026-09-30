export type CommandKind = "section" | "action" | "system";

export type Command = {
  name: string;
  aliases?: readonly string[];
  kind: CommandKind;
  description: string;
  /** Section id to scroll to, for kind "section". */
  target?: string;
  /** Macro chip shown in the hero. */
  chip?: { label: string; danger?: boolean };
  /** Top-bar tab label. */
  tab?: string;
  /** One-line confirmation printed after running. */
  result?: string;
};

// The single source of truth for the prompt, autocomplete, /help, chips and tabs.
export const commands: readonly Command[] = [
  {
    name: "/user",
    kind: "section",
    target: "user",
    description: "Show the identity summary",
    chip: { label: "identity" },
    tab: "[1: console.sh]",
    result: "Opened identity → ~/.terminal/user.json",
  },
  {
    name: "/experience",
    kind: "section",
    target: "experience",
    description: "Show the experience timeline",
    chip: { label: "history" },
    tab: "[2: experience.log]",
    result: "Opened experience timeline → ~/.terminal/experience.log",
  },
  {
    name: "/skills",
    kind: "section",
    target: "skills",
    description: "Show the skills matrix",
    chip: { label: "matrix" },
    tab: "[3: skills.json]",
    result: "Opened skills matrix → ~/.terminal/skills.json",
  },
  {
    name: "/projects",
    kind: "section",
    target: "projects",
    description: "Show selected projects",
    chip: { label: "crates" },
    result: "Opened projects → ~/.terminal/projects.md",
  },
  {
    name: "/contact",
    kind: "section",
    target: "contact",
    description: "Show contact links and the CV",
    result: "Opened contact → ~/.terminal/contact.txt",
  },
  {
    name: "/takeaways",
    kind: "section",
    target: "takeaways",
    description: "Show key takeaways",
    result: "Opened takeaways → ~/.terminal/takeaways.md",
  },
  {
    name: ":theme",
    aliases: ["/theme"],
    kind: "action",
    description: "List or switch colour themes (:theme [name])",
    chip: { label: "palette" },
  },
  {
    name: "/help",
    kind: "system",
    description: "List every available command",
    chip: { label: "manpage" },
    tab: "[4: help.txt]",
  },
  {
    name: "/clear",
    aliases: [":c"],
    kind: "system",
    description: "Reset the output to the boot card",
    chip: { label: "reset", danger: true },
  },
  {
    name: ":w",
    kind: "action",
    description: "Download the CV",
  },
  {
    name: ":q",
    kind: "action",
    description: "Try to quit (good luck)",
  },
];

export const chipCommands = commands.filter((c) => c.chip);
export const tabCommands = commands.filter((c) => c.tab);

/** Case-insensitive, whitespace-trimmed; the first word is the command name. */
export function parse(input: string): { name: string; args: string[] } {
  const [name = "", ...args] = input.trim().toLowerCase().split(/\s+/);
  return { name, args };
}

export function find(name: string): Command | undefined {
  return commands.find((c) => c.name === name || c.aliases?.includes(name));
}

export type Suggestion = { text: string; kind: CommandKind };

/** Every name and alias that starts with the partial input. */
export function suggest(partial: string): Suggestion[] {
  const p = partial.trim().toLowerCase();
  if (!p) return [];
  return commands
    .flatMap((c) => [c.name, ...(c.aliases ?? [])].map((text) => ({ text, kind: c.kind })))
    .filter((s) => s.text.startsWith(p));
}

export function commonPrefix(items: readonly string[]): string {
  return items.reduce((prefix, item) => {
    let i = 0;
    while (i < prefix.length && prefix[i] === item[i]) i++;
    return prefix.slice(0, i);
  });
}
