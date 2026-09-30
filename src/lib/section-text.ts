import type { Profile } from "@/content/types";

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
