import type {
  Content,
  ContactEntry,
  Experience,
  Profile,
  Project,
  Skill,
  Takeaway,
} from "@/content/types";

/** Plain-text form of the identity section; frame counters derive from it. */
export function identityLines(profile: Profile): string[] {
  return [
    `name: ${profile.name}`,
    `title: ${profile.title}`,
    `tags: ${profile.tags.join(", ")}`,
    `location: ${profile.location}`,
    `status: ${profile.availability.status} — ${profile.availability.detail}`,
    ...profile.bio,
  ];
}

export function measure(lines: readonly string[]) {
  const text = lines.join("\n");
  return { lines: lines.length, bytes: new TextEncoder().encode(text).length };
}

/** "TODO" while any line still holds placeholder copy, otherwise "OK". */
export function statusTag(lines: readonly string[]): "TODO" | "OK" {
  return lines.some((line) => line.includes("TODO")) ? "TODO" : "OK";
}

export const BAR_WIDTH = 20;

/** ASCII bar for a 0-100 level; filled cells always match the percentage. */
export function skillBar(level: number): string {
  const clamped = Math.min(100, Math.max(0, level));
  const filled = Math.round((clamped / 100) * BAR_WIDTH);
  return `[${"█".repeat(filled)}${"░".repeat(BAR_WIDTH - filled)}] ${clamped}%`;
}

export function experienceLines(items: readonly Experience[]): string[] {
  return items.flatMap((e) => [
    `${e.role} @ ${e.company}`,
    `${e.period} | ${e.location}`,
    ...e.achievements.map((a) => `- ${a}`),
    `stack: ${e.stack.join(", ")}`,
  ]);
}

export function skillsLines(items: readonly Skill[]): string[] {
  return items.map((s) => `${s.group}/${s.label} ${skillBar(s.level)}`);
}

export function projectsLines(items: readonly Project[]): string[] {
  return items.flatMap((p) => [
    p.name + (p.stars !== undefined ? ` ★${p.stars}` : ""),
    p.description,
    `stack: ${p.stack.join(", ")}`,
    p.link,
  ]);
}

export function contactLines(
  items: readonly ContactEntry[],
  cv: Content["cv"],
): string[] {
  return [
    ...items.map((c) => `${c.label}: ${c.value}`),
    `cv: ${cv.filename}`,
  ];
}

export function takeawaysLines(items: readonly Takeaway[]): string[] {
  return items.map((t) => `${t.title}: ${t.detail}`);
}
