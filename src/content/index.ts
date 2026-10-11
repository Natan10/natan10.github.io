import type { Language } from "@/lib/i18n";
import type { Content } from "./types";
import { en } from "./en";
import { pt } from "./pt";
import { shared } from "./shared";
import type { ContentText } from "./text";

const texts: Record<Language, ContentText> = { en, pt };

/** The complete content of one language: the shared values plus its text. */
export function getContent(language: Language): Content {
  const text = texts[language];
  return {
    profile: {
      name: shared.profile.name,
      title: shared.profile.title,
      tags: shared.profile.tags,
      location: text.profile.location,
      availability: text.profile.availability,
      bio: text.profile.bio,
      photo: { src: shared.profile.photoSrc, alt: text.profile.photoAlt },
    },
    experience: shared.experience.map((e) => ({
      role: e.role,
      company: e.company,
      stack: e.stack,
      ...text.experience[e.id],
    })),
    skills: shared.skills.map((s) => ({
      group: text.skillGroups[s.group],
      label: s.label,
      level: s.level,
    })),
    projects: shared.projects.map((p) => ({
      name: p.name,
      stack: p.stack,
      link: p.link,
      description: text.projects[p.id].description,
    })),
    contact: shared.contact,
    takeaways: shared.takeaways.map((t) => text.takeaways[t.id]),
    cv: shared.cv,
  };
}
