// TODO(owner): confirm real name, title and copy. The full typed content layer arrives in ticket 02.
export const site = {
  name: "Natan Moreira",
  bannerWord: "NATAN",
  title: "Software Developer",
  description:
    "Personal portfolio of Natan Moreira, software developer: experience, skills, projects and key takeaways.",
  version: "v0.1.0",
} as const;

export const tabs = [
  "[1: console.sh]",
  "[2: experience.log]",
  "[3: skills.json]",
  "[4: help.txt]",
] as const;

export const chips = [
  { command: "/user", label: "identity" },
  { command: "/experience", label: "history" },
  { command: "/skills", label: "matrix" },
  { command: "/projects", label: "crates" },
  { command: "/theme", label: "palette" },
  { command: "/help", label: "manpage" },
  { command: "/clear", label: "reset", danger: true },
] as const;
