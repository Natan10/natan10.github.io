import type { ContentText } from "./text";

// Source: the owner's resume (public/cv.pdf). Skill levels are the owner's to
// tune; the resume lists skills without proficiency.
export const en: ContentText = {
  profile: {
    location: "Fortaleza, Brazil",
    availability: {
      status: "Remote",
      detail: "Senior Frontend Engineer at Hapvida",
    },
    bio: [
      "FullStack Software Engineer with over 5 years of experience designing and building scalable cloud-native applications using React, Node.js, .NET, Python, AWS and Azure. Passionate about distributed systems, software architecture and developer experience, with production experience in AI-powered document processing pipelines, asynchronous workflows and observability. Committed to maintainable, high-quality software through SOLID, Clean Architecture and TDD.",
    ],
    photoAlt: "Portrait of Natan Moreira",
  },
  experience: {
    hapvida: {
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
    },
    lumi: {
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
    },
    btg: {
      period: "07/2021 – 07/2025",
      location: "Sao Paulo, Brazil (remote)",
      achievements: [
        "Developed React web applications with Azure pipelines, Jenkins CI/CD and Scrum/Kanban.",
        "Unit and integration testing with Jest, end-to-end testing with Cypress, and Storybook for the component library and design system.",
        "Used React Query to improve request speed and caching; practised TDD and Clean Architecture.",
        "Worked on Azure and AWS with infrastructure as code (CloudFormation), Aurora DB, SQS, SNS and Lambda.",
      ],
    },
    insight: {
      period: "09/2020 – 07/2021",
      location: "Fortaleza, Brazil (remote)",
      achievements: [
        "Built web applications for the state government with React, a style guide and Leaflet map visualisations.",
        "Created GitLab CI/CD routines and used AWS resources such as EC2.",
        "Built a REST API with Spring Boot and MongoDB Atlas, including domain modelling and architecture.",
        "Added unit tests to the back-end and Cypress end-to-end tests to the front-end.",
      ],
    },
    "medical-devices": {
      period: "10/2020 – 12/2020",
      location: "Fortaleza, Brazil (remote, part-time)",
      achievements: [
        "Built a React application using Redux.",
        "Built a web API in Ruby on Rails integrated with payment gateways such as Pagar.me.",
      ],
    },
    gti: {
      period: "06/2019 – 09/2020",
      location: "Fortaleza, Brazil (remote, voluntary part-time)",
      achievements: [
        "Built web applications with Ruby on Rails, PostgreSQL and payment gateway integrations.",
        "Built websites with WordPress.",
      ],
    },
  },
  skillGroups: {
    frontend: "Frontend",
    backend: "Backend",
    data: "Data",
    cloud: "Cloud",
    practices: "Practices",
    ai: "AI",
  },
  projects: {
    "invoice-pipeline": {
      description:
        "Asynchronous, AI-based invoice extraction workflow for an energy billing platform, built on queues and serverless functions.",
    },
    observability: {
      description:
        "Tracing, metrics and logs across microservices with OpenTelemetry and the LGTM stack.",
    },
    integrations: {
      description:
        "ETL processes synchronising billing and operational data across multiple external platforms.",
    },
  },
  takeaways: {
    testability: {
      title: "Design for testability first",
      detail:
        "SOLID, Clean Architecture and TDD turn legacy-shaped code into modules that can be unit tested, as with the invoice reader refactor.",
    },
    "async-slow-work": {
      title: "Async by default for slow work",
      detail:
        "Queues, serverless functions and object storage keep AI extraction and integrations resilient and scalable.",
    },
    observability: {
      title: "Observe before you guess",
      detail:
        "Logs, traces and metrics (Datadog, Elastic, OpenTelemetry, LGTM) shorten the path from incident to root cause.",
    },
    pipeline: {
      title: "Automate the pipeline",
      detail:
        "CI/CD on Azure DevOps and GitHub Actions plus Cypress end-to-end tests catch regressions before users do.",
    },
    "server-state": {
      title: "Server state is not global state",
      detail:
        "React Query for server data and Zustand for client state keep interfaces fast and easy to maintain.",
    },
  },
};
