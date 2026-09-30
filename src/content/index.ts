import type { Content } from "./types";

// Source: the owner's resume (public/cv.pdf). Skill levels are the owner's to
// tune; the resume lists skills without proficiency.
export const content: Content = {
  profile: {
    name: "Natan Moreira",
    title: "Software Engineer",
    tags: ["FullStack", "React", "Node.js", ".NET", "AWS", "Azure", "AI workflows"],
    location: "Fortaleza, Brazil",
    availability: {
      status: "Remote",
      detail: "Senior Frontend Engineer at Hapvida",
    },
    bio: [
      "FullStack Software Engineer with over 5 years of experience designing and building scalable cloud-native applications using React, Node.js, .NET, Python, AWS and Azure. Passionate about distributed systems, software architecture and developer experience, with production experience in AI-powered document processing pipelines, asynchronous workflows and observability. Committed to maintainable, high-quality software through SOLID, Clean Architecture and TDD.",
    ],
    photo: { src: "/avatar.jpg", alt: "Portrait of Natan Moreira" },
  },
  experience: [
    {
      role: "Senior Frontend Engineer",
      company: "Hapvida",
      period: "07/2025 – Present",
      location: "Fortaleza, Brazil (remote)",
      achievements: [
        "Build and maintain scalable React front-ends following SOLID, TDD and modern engineering practices.",
        "Build complex, interactive interfaces with React Query for server state and Zustand for global state, focused on performance and maintainability.",
        "Implement end-to-end tests with Cypress, improving reliability and reducing regressions.",
        "Contribute to .NET back-end APIs and business logic alongside cross-functional teams.",
        "Monitor and troubleshoot production with Datadog and the Elastic Stack.",
        "Maintain Azure DevOps CI/CD pipelines for cloud-native applications on Microsoft Azure.",
      ],
      stack: ["React", "React Query", "Zustand", "Cypress", ".NET", "Azure", "Datadog", "Elastic"],
    },
    {
      role: "FullStack Developer",
      company: "Lumi",
      period: "08/2025 – 06/2026",
      location: "Sao Paulo, Brazil (remote, part-time)",
      achievements: [
        "Built full-stack features for an energy billing and compensation platform with React, Zustand and React Query.",
        "Designed scalable APIs with Node.js and NestJS using SOLID, Clean Architecture and TDD across multiple microservices.",
        "Refactored the invoice reader into a modular, testable design, significantly improving maintainability.",
        "Designed an asynchronous AI invoice-extraction pipeline on AWS Lambda, SQS, S3, MongoDB and PostgreSQL.",
        "Designed an observability architecture with OpenTelemetry and the LGTM stack.",
        "Built ETL integrations with ERP systems and solar energy providers to synchronise billing and operational data.",
        "Built GitHub Actions CI/CD pipelines across multiple Node.js applications.",
      ],
      stack: ["React", "Node.js", "NestJS", "AWS", "MongoDB", "PostgreSQL", "OpenTelemetry", "GitHub Actions"],
    },
    {
      role: "Software Engineer",
      company: "BTG Pactual",
      period: "07/2021 – 07/2025",
      location: "Sao Paulo, Brazil (remote)",
      achievements: [
        "Developed React web applications with Azure pipelines, Jenkins CI/CD and Scrum/Kanban.",
        "Unit and integration testing with Jest, end-to-end testing with Cypress, and Storybook for the component library and design system.",
        "Used React Query to improve request speed and caching; practised TDD and Clean Architecture.",
        "Worked on Azure and AWS with infrastructure as code (CloudFormation), Aurora DB, SQS, SNS and Lambda.",
      ],
      stack: ["React", "Jest", "Cypress", "Storybook", "Azure", "AWS", "CloudFormation"],
    },
    {
      role: "FullStack Developer",
      company: "Insight Data Science Lab",
      period: "09/2020 – 07/2021",
      location: "Fortaleza, Brazil (remote)",
      achievements: [
        "Built web applications for the state government with React, a style guide and Leaflet map visualisations.",
        "Created GitLab CI/CD routines and used AWS resources such as EC2.",
        "Built a REST API with Spring Boot and MongoDB Atlas, including domain modelling and architecture.",
        "Added unit tests to the back-end and Cypress end-to-end tests to the front-end.",
      ],
      stack: ["React", "Leaflet", "Spring Boot", "MongoDB", "GitLab CI", "AWS", "Cypress"],
    },
    {
      role: "FullStack Developer",
      company: "Medical Devices",
      period: "10/2020 – 12/2020",
      location: "Fortaleza, Brazil (remote, part-time)",
      achievements: [
        "Built a React application using Redux.",
        "Built a web API in Ruby on Rails integrated with payment gateways such as Pagar.me.",
      ],
      stack: ["React", "Redux", "Ruby on Rails"],
    },
    {
      role: "FullStack Developer",
      company: "GTI Engenharia JR",
      period: "06/2019 – 09/2020",
      location: "Fortaleza, Brazil (remote, voluntary part-time)",
      achievements: [
        "Built web applications with Ruby on Rails, PostgreSQL and payment gateway integrations.",
        "Built websites with WordPress.",
      ],
      stack: ["Ruby on Rails", "PostgreSQL", "WordPress"],
    },
  ],
  skills: [
    { group: "Frontend", label: "React", level: 95 },
    { group: "Frontend", label: "JavaScript", level: 90 },
    { group: "Frontend", label: "React Native", level: 60 },
    { group: "Frontend", label: "Cypress", level: 85 },
    { group: "Frontend", label: "Playwright", level: 70 },
    { group: "Backend", label: "Node.js", level: 85 },
    { group: "Backend", label: ".NET", level: 70 },
    { group: "Backend", label: "Python", level: 65 },
    { group: "Backend", label: "Golang", level: 45 },
    { group: "Data", label: "PostgreSQL", level: 80 },
    { group: "Data", label: "MongoDB", level: 80 },
    { group: "Data", label: "Redis", level: 65 },
    { group: "Cloud", label: "AWS", level: 85 },
    { group: "Cloud", label: "Azure", level: 75 },
    { group: "Cloud", label: "Git", level: 90 },
    { group: "Practices", label: "TDD", level: 90 },
    { group: "Practices", label: "SOLID", level: 90 },
    { group: "Practices", label: "Clean Architecture", level: 90 },
    { group: "Practices", label: "Clean Code", level: 90 },
    { group: "AI", label: "AI Models", level: 70 },
    { group: "AI", label: "AI Agent Workflows", level: 70 },
  ],
  projects: [
    {
      name: "AI invoice processing pipeline",
      description:
        "Asynchronous, AI-based invoice extraction workflow for an energy billing platform, built on queues and serverless functions.",
      stack: ["AWS Lambda", "SQS", "S3", "MongoDB", "PostgreSQL"],
      link: "https://github.com/Natan10",
    },
    {
      name: "Observability architecture",
      description:
        "Tracing, metrics and logs across microservices with OpenTelemetry and the LGTM stack.",
      stack: ["OpenTelemetry", "Grafana", "Loki", "Tempo", "Mimir"],
      link: "https://github.com/Natan10",
    },
    {
      name: "ERP and solar provider integrations",
      description:
        "ETL processes synchronising billing and operational data across multiple external platforms.",
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
    {
      title: "Design for testability first",
      detail:
        "SOLID, Clean Architecture and TDD turn legacy-shaped code into modules that can be unit tested, as with the invoice reader refactor.",
    },
    {
      title: "Async by default for slow work",
      detail:
        "Queues, serverless functions and object storage keep AI extraction and integrations resilient and scalable.",
    },
    {
      title: "Observe before you guess",
      detail:
        "Logs, traces and metrics (Datadog, Elastic, OpenTelemetry, LGTM) shorten the path from incident to root cause.",
    },
    {
      title: "Automate the pipeline",
      detail:
        "CI/CD on Azure DevOps and GitHub Actions plus Cypress end-to-end tests catch regressions before users do.",
    },
    {
      title: "Server state is not global state",
      detail:
        "React Query for server data and Zustand for client state keep interfaces fast and easy to maintain.",
    },
  ],
  cv: { href: "/cv.pdf", filename: "Natanael_Moreira_Resume.pdf" },
};
