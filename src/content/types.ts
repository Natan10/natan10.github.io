// Typed content layer. Every field is required unless marked optional, so a
// missing field is a type error and fails `next build`.

export type Profile = {
  name: string;
  title: string;
  tags: readonly string[];
  location: string;
  availability: { status: string; detail: string };
  bio: readonly string[];
  /** Path under /public. `null` renders a clearly marked placeholder. */
  photo: { src: string; alt: string } | null;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  location: string;
  achievements: readonly string[];
  stack: readonly string[];
};

export type Skill = { group: string; label: string; level: number };

export type Project = {
  name: string;
  description: string;
  stack: readonly string[];
  link: string;
  stars?: number;
};

export type ContactEntry = { label: string; value: string; href: string };

export type Takeaway = { title: string; detail: string };

/** The public Spotify playlist; both URLs derive from its id. */
export type Playlist = {
  id: string;
  /** Public page, opened by plain links. */
  url: string;
  /** Embed iframe source, dark theme. */
  embedUrl: string;
};

export type Content = {
  profile: Profile;
  experience: readonly Experience[];
  skills: readonly Skill[];
  projects: readonly Project[];
  contact: readonly ContactEntry[];
  takeaways: readonly Takeaway[];
  /** Public URL of the CV file. */
  cv: { href: string; filename: string };
  playlist: Playlist;
};
