import type { shared } from "./shared";

type Shared = typeof shared;

export type ExperienceId = Shared["experience"][number]["id"];
export type SkillGroupId = Shared["skills"][number]["group"];
export type ProjectId = Shared["projects"][number]["id"];
export type TakeawayId = Shared["takeaways"][number]["id"];

/**
 * The translatable text of the personal content, keyed by the ids in `shared`.
 * Each language must supply every key and no other: a missing or extra entry
 * is a type error, so the pages cannot differ in how many entries they hold.
 */
export type ContentText = {
  profile: {
    location: string;
    availability: { status: string; detail: string };
    bio: readonly string[];
    photoAlt: string;
  };
  experience: Record<
    ExperienceId,
    { period: string; location: string; achievements: readonly string[] }
  >;
  skillGroups: Record<SkillGroupId, string>;
  projects: Record<ProjectId, { description: string }>;
  takeaways: Record<TakeawayId, { title: string; detail: string }>;
};
