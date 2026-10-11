// Values that do not change with the language: ids, names, stacks, levels,
// links and contact details. They are stated once, so the two languages cannot
// disagree on them or on how many entries each section has.
export const shared = {
  profile: {
    name: "Natan Moreira",
    title: "Software Engineer",
    tags: ["FullStack", "React", "Node.js", ".NET", "AWS", "Azure", "AI workflows"],
    photoSrc: "/avatar.jpg",
  },
  experience: [
    {
      id: "hapvida",
      role: "Senior Frontend Engineer",
      company: "Hapvida",
      stack: ["React", "React Query", "Zustand", "Cypress", ".NET", "Azure", "Datadog", "Elastic"],
    },
    {
      id: "lumi",
      role: "FullStack Developer",
      company: "Lumi",
      stack: ["React", "Node.js", "NestJS", "AWS", "MongoDB", "PostgreSQL", "OpenTelemetry", "GitHub Actions"],
    },
    {
      id: "btg",
      role: "Software Engineer",
      company: "BTG Pactual",
      stack: ["React", "Jest", "Cypress", "Storybook", "Azure", "AWS", "CloudFormation"],
    },
    {
      id: "insight",
      role: "FullStack Developer",
      company: "Insight Data Science Lab",
      stack: ["React", "Leaflet", "Spring Boot", "MongoDB", "GitLab CI", "AWS", "Cypress"],
    },
    {
      id: "medical-devices",
      role: "FullStack Developer",
      company: "Medical Devices",
      stack: ["React", "Redux", "Ruby on Rails"],
    },
    {
      id: "gti",
      role: "FullStack Developer",
      company: "GTI Engenharia JR",
      stack: ["Ruby on Rails", "PostgreSQL", "WordPress"],
    },
  ],
  // The group is an id; each language names it (see `skillGroups`).
  skills: [
    { group: "frontend", label: "React", level: 95 },
    { group: "frontend", label: "JavaScript", level: 90 },
    { group: "frontend", label: "React Native", level: 60 },
    { group: "frontend", label: "Cypress", level: 85 },
    { group: "frontend", label: "Playwright", level: 70 },
    { group: "backend", label: "Node.js", level: 85 },
    { group: "backend", label: ".NET", level: 70 },
    { group: "backend", label: "Python", level: 65 },
    { group: "backend", label: "Golang", level: 45 },
    { group: "data", label: "PostgreSQL", level: 80 },
    { group: "data", label: "MongoDB", level: 80 },
    { group: "data", label: "Redis", level: 65 },
    { group: "cloud", label: "AWS", level: 85 },
    { group: "cloud", label: "Azure", level: 75 },
    { group: "cloud", label: "Git", level: 90 },
    { group: "practices", label: "TDD", level: 90 },
    { group: "practices", label: "SOLID", level: 90 },
    { group: "practices", label: "Clean Architecture", level: 90 },
    { group: "practices", label: "Clean Code", level: 90 },
    { group: "ai", label: "AI Models", level: 70 },
    { group: "ai", label: "AI Agent Workflows", level: 70 },
  ],
  projects: [
    {
      id: "invoice-pipeline",
      name: "AI invoice processing pipeline",
      stack: ["AWS Lambda", "SQS", "S3", "MongoDB", "PostgreSQL"],
      link: "https://github.com/Natan10",
    },
    {
      id: "observability",
      name: "Observability architecture",
      stack: ["OpenTelemetry", "Grafana", "Loki", "Tempo", "Mimir"],
      link: "https://github.com/Natan10",
    },
    {
      id: "integrations",
      name: "ERP and solar provider integrations",
      stack: ["Node.js", "NestJS", "ETL", "PostgreSQL"],
      link: "https://github.com/Natan10",
    },
  ],
  contact: [
    {
      label: "email",
      value: "natan-moreira1@hotmail.com",
      href: "mailto:natan-moreira1@hotmail.com",
    },
    {
      label: "linkedin",
      value: "linkedin.com/in/natan-moreira",
      href: "https://www.linkedin.com/in/natan-moreira/",
    },
    { label: "github", value: "github.com/Natan10", href: "https://github.com/Natan10" },
  ],
  takeaways: [
    { id: "testability" },
    { id: "async-slow-work" },
    { id: "observability" },
    { id: "pipeline" },
    { id: "server-state" },
  ],
  cv: { href: "/cv.pdf", filename: "Natanael_Moreira_Resume.pdf" },
} as const;
