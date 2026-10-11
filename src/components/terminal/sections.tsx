import type { Content } from "@/content/types";
import type { Dictionary } from "@/lib/dictionary";
import { fill } from "@/lib/i18n";
import {
  contactLines,
  experienceLines,
  projectsLines,
  skillBar,
  skillsLines,
  takeawaysLines,
} from "@/lib/section-text";
import { Chip } from "./chip";
import { SectionFrame } from "./section-frame";

type Props = { content: Content; dict: Dictionary };

function StackList({ items, label }: { items: readonly string[]; label: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-space-xs">
      {items.map((s) => (
        <Chip key={s}>{s}</Chip>
      ))}
    </ul>
  );
}

export function Experience({ content, dict }: Props) {
  return (
    <SectionFrame
      id="experience"
      command="/experience"
      file="~/.terminal/experience.log"
      lines={experienceLines(content.experience)}
      countsLabel={dict.sections.frameCounts}
    >
      <h2 className="sr-only">{dict.sections.experience}</h2>
      <ol className="flex flex-col gap-space-lg border-l border-outline-variant pl-space-md">
        {content.experience.map((e) => (
          <li key={`${e.company}-${e.period}`} className="flex flex-col gap-space-xs">
            <h3 className="text-headline-md text-primary">{e.role}</h3>
            <p className="text-body-md text-on-surface">
              {e.company} <span className="text-outline">|</span> {e.location}
            </p>
            <p className="text-label-md text-secondary">{e.period}</p>
            <ul className="list-disc pl-space-md text-body-md text-on-surface-variant">
              {e.achievements.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
            <StackList items={e.stack} label={dict.sections.stack} />
          </li>
        ))}
      </ol>
    </SectionFrame>
  );
}

export function Skills({ content, dict }: Props) {
  const groups = Map.groupBy(content.skills, (s) => s.group);
  return (
    <SectionFrame
      id="skills"
      command="/skills"
      file="~/.terminal/skills.json"
      lines={skillsLines(content.skills)}
      countsLabel={dict.sections.frameCounts}
    >
      <h2 className="sr-only">{dict.sections.skills}</h2>
      <div className="grid gap-space-lg md:grid-cols-2">
        {[...groups].map(([group, skills]) => (
          <div key={group} className="flex flex-col gap-space-xs">
            <h3 className="text-headline-md text-primary">{group}</h3>
            <ul className="flex flex-col gap-space-xs">
              {skills.map((s) => (
                <li
                  key={s.label}
                  className="flex flex-wrap items-center justify-between gap-x-space-md text-body-md"
                >
                  <span>{s.label}</span>
                  <span
                    data-testid="skill-bar"
                    className="text-secondary whitespace-pre [font-variant-ligatures:none]"
                  >
                    {skillBar(s.level)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}

export function Projects({ content, dict }: Props) {
  return (
    <SectionFrame
      id="projects"
      command="/projects"
      file="~/.terminal/projects.md"
      lines={projectsLines(content.projects)}
      countsLabel={dict.sections.frameCounts}
    >
      <h2 className="sr-only">{dict.sections.projects}</h2>
      <ul className="grid gap-space-md md:grid-cols-2">
        {content.projects.map((p) => (
          <li
            key={p.name}
            className="border border-outline-variant bg-surface-container-low p-space-md flex flex-col gap-space-sm"
          >
            <h3 className="text-headline-md text-primary">
              {p.name}
              {p.stars !== undefined && (
                <span className="ml-space-sm text-label-md text-tertiary">
                  ★ {p.stars}
                </span>
              )}
            </h3>
            <p className="text-body-md text-on-surface-variant">{p.description}</p>
            <StackList items={p.stack} label={dict.sections.stack} />
            <a
              href={p.link}
              className="text-secondary underline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {p.link}
            </a>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}

export function Takeaways({ content, dict }: Props) {
  return (
    <SectionFrame
      id="takeaways"
      command="/takeaways"
      file="~/.terminal/takeaways.md"
      lines={takeawaysLines(content.takeaways)}
      countsLabel={dict.sections.frameCounts}
    >
      <h2 className="sr-only">{dict.sections.takeaways}</h2>
      <ul className="flex flex-col gap-space-md">
        {content.takeaways.map((t) => (
          <li key={t.title}>
            <h3 className="text-headline-md text-primary">{t.title}</h3>
            <p className="text-body-md text-on-surface-variant">{t.detail}</p>
          </li>
        ))}
      </ul>
    </SectionFrame>
  );
}

export function Contact({ content, dict }: Props) {
  const { contact, cv, playlist } = content;
  return (
    <SectionFrame
      id="contact"
      command="/contact"
      file="~/.terminal/contact.txt"
      lines={contactLines(contact, cv)}
      countsLabel={dict.sections.frameCounts}
    >
      <h2 className="sr-only">{dict.sections.contact}</h2>
      <ul className="flex flex-col gap-space-xs text-body-md">
        {contact.map((c) => (
          <li key={c.label} className="flex gap-space-md">
            <span className="text-outline w-24 shrink-0">{c.label}</span>
            <a
              href={c.href}
              className="text-secondary underline break-all focus-visible:outline-2 focus-visible:outline-primary"
            >
              {c.value}
            </a>
          </li>
        ))}
        <li className="flex gap-space-md">
          <span className="text-outline w-24 shrink-0">cv</span>
          <a
            href={cv.href}
            download={cv.filename}
            className="text-secondary underline break-all focus-visible:outline-2 focus-visible:outline-primary"
          >
            {fill(dict.sections.downloadCv, { file: cv.filename })}
          </a>
        </li>
      </ul>
      <p className="mt-space-xs text-body-md">
        <a
          href={playlist.url}
          className="text-secondary underline break-all focus-visible:outline-2 focus-visible:outline-primary"
        >
          {dict.sections.spotifyPlaylist}
        </a>
      </p>
    </SectionFrame>
  );
}
