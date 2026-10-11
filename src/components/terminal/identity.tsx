import type { Content } from "@/content/types";
import type { Dictionary } from "@/lib/dictionary";
import { identityLines } from "@/lib/section-text";
import { SectionFrame } from "./section-frame";

export function Identity({
  profile,
  dict,
}: {
  profile: Content["profile"];
  dict: Dictionary;
}) {
  return (
    <SectionFrame
      id="user"
      command="/user"
      file="~/.terminal/user.json"
      lines={identityLines(profile)}
      countsLabel={dict.sections.frameCounts}
    >
      <div className="flex flex-col sm:flex-row gap-space-lg">
        <div
          data-testid="avatar"
          className="w-32 h-32 shrink-0 border border-outline-variant bg-surface-container flex items-center justify-center text-center text-label-sm text-error p-space-xs"
        >
          {profile.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.photo.src}
              alt={profile.photo.alt}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{dict.sections.photoPlaceholder}</span>
          )}
        </div>
        <div className="flex flex-col gap-space-sm min-w-0">
          <h2 className="text-headline-lg text-primary">{profile.name}</h2>
          <p className="text-body-lg text-on-surface">{profile.title}</p>
          <ul aria-label={dict.sections.tags} className="flex flex-wrap gap-space-xs">
            {profile.tags.map((tag) => (
              <li
                key={tag}
                className="px-space-xs bg-surface-container text-secondary text-label-md"
              >
                #{tag}
              </li>
            ))}
          </ul>
          <dl className="grid grid-cols-[auto_1fr] gap-x-space-md text-body-md">
            <dt className="text-outline">{dict.sections.location}</dt>
            <dd>{profile.location}</dd>
            <dt className="text-outline">{dict.sections.status}</dt>
            <dd>
              <span className="text-primary font-bold">
                {profile.availability.status}
              </span>{" "}
              — {profile.availability.detail}
            </dd>
          </dl>
          {profile.bio.map((paragraph) => (
            <p key={paragraph} className="text-body-md text-on-surface-variant">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
