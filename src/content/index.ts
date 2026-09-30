import type { Content } from "./types";

// TODO(owner): replace every "TODO" value below with real copy. Anything still
// marked TODO must not ship.
export const content: Content = {
  profile: {
    name: "Natan Moreira",
    title: "Software Developer",
    tags: ["TODO: tag one", "TODO: tag two"],
    location: "TODO: city, country",
    availability: {
      status: "TODO: availability status",
      detail: "TODO: availability detail",
    },
    bio: ["TODO: short bio paragraph."],
    photo: null,
  },
  experience: [
    {
      role: "TODO: role",
      company: "TODO: company",
      period: "TODO: period",
      location: "TODO: location",
      achievements: ["TODO: achievement"],
      stack: ["TODO: stack"],
    },
  ],
  skills: [{ group: "TODO: group", label: "TODO: skill", level: 0 }],
  projects: [
    {
      name: "TODO: project",
      description: "TODO: description",
      stack: ["TODO: stack"],
      link: "TODO: https://example.com",
    },
  ],
  contact: [{ label: "email", value: "TODO: email", href: "mailto:TODO" }],
  takeaways: [{ title: "TODO: takeaway", detail: "TODO: detail" }],
  cv: { href: "/cv.pdf", filename: "TODO-cv.pdf" },
};
