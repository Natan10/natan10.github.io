export type CommandKind = "section" | "action" | "system";

type CommandDef = {
  name: string;
  aliases?: readonly string[];
  kind: CommandKind;
  /** Section id to scroll to, for kind "section". */
  target?: string;
  /** Macro chip shown in the hero. */
  chip?: { danger?: boolean };
};

// The single source of truth for the prompt, autocomplete, /help and chips.
// It holds no display text: descriptions, results and chip captions come from
// the active language's dictionary, keyed by command name.
const registry = [
  { name: "/user", kind: "section", target: "user", chip: {} },
  { name: "/experience", kind: "section", target: "experience", chip: {} },
  { name: "/skills", kind: "section", target: "skills", chip: {} },
  { name: "/projects", kind: "section", target: "projects", chip: {} },
  { name: "/contact", kind: "section", target: "contact" },
  { name: "/takeaways", kind: "section", target: "takeaways" },
  { name: ":theme", aliases: ["/theme"], kind: "action", chip: {} },
  { name: "/language", aliases: [":language"], kind: "action" },
  { name: "/help", kind: "system", chip: {} },
  { name: "/clear", aliases: [":c"], kind: "system", chip: { danger: true } },
  { name: ":w", kind: "action" },
  { name: ":q", kind: "action" },
] as const satisfies readonly CommandDef[];

type Entry = (typeof registry)[number];

export type CommandName = Entry["name"];

export type Command = CommandDef & { name: CommandName };

/**
 * The texts every language must supply, per command: all need a description,
 * section commands also a result line, and chip commands a chip caption. A
 * missing one is a type error.
 */
export type CommandTexts = {
  [E in Entry as E["name"]]: { description: string } & (E extends {
    kind: "section";
  }
    ? { result: string }
    : unknown) &
    (E extends { chip: object } ? { chip: string } : unknown);
};

export const commands: readonly Command[] = registry;

export const chipCommands = commands.filter((c) => c.chip);

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
