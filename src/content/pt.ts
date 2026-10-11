import type { ContentText } from "./text";

// Brazilian Portuguese. Job titles stay in English (shared), and the wording
// avoids gendered forms: first-person verbs and noun phrases, no adjectives
// that agree with the owner's gender.
export const pt: ContentText = {
  profile: {
    location: "Fortaleza, Brasil",
    availability: {
      status: "Remoto",
      detail: "Senior Frontend Engineer na Hapvida",
    },
    bio: [
      "FullStack Software Engineer com mais de 5 anos de experiência em projeto e construção de aplicações cloud-native escaláveis com React, Node.js, .NET, Python, AWS e Azure. Interesse especial por sistemas distribuídos, arquitetura de software e experiência de desenvolvimento, com atuação em produção em pipelines de processamento de documentos com IA, fluxos assíncronos e observabilidade. Foco em software sustentável e de alta qualidade com SOLID, Clean Architecture e TDD.",
    ],
    photoAlt: "Retrato de Natan Moreira",
  },
  experience: {
    hapvida: {
      period: "07/2025 – Atual",
      location: "Fortaleza, Brasil (remoto)",
      achievements: [
        "Construo e mantenho front-ends React escaláveis seguindo SOLID, TDD e práticas modernas de engenharia.",
        "Construo interfaces complexas e interativas com React Query para estado de servidor e Zustand para estado global, com foco em desempenho e manutenibilidade.",
        "Implemento testes end-to-end com Cypress, aumentando a confiabilidade e reduzindo regressões.",
        "Contribuo com APIs e regras de negócio em .NET junto a times multifuncionais.",
        "Monitoro e investigo problemas em produção com Datadog e Elastic Stack.",
        "Mantenho pipelines de CI/CD no Azure DevOps para aplicações cloud-native no Microsoft Azure.",
      ],
    },
    lumi: {
      period: "08/2025 – 06/2026",
      location: "São Paulo, Brasil (remoto, meio período)",
      achievements: [
        "Construí funcionalidades full-stack para uma plataforma de faturamento e compensação de energia com React, Zustand e React Query.",
        "Projetei APIs escaláveis com Node.js e NestJS usando SOLID, Clean Architecture e TDD em vários microsserviços.",
        "Refatorei o leitor de faturas para um design modular e testável, melhorando significativamente a manutenibilidade.",
        "Projetei um pipeline assíncrono de extração de faturas com IA na AWS com Lambda, SQS, S3, MongoDB e PostgreSQL.",
        "Projetei uma arquitetura de observabilidade com OpenTelemetry e a stack LGTM.",
        "Construí integrações ETL com sistemas ERP e provedores de energia solar para sincronizar dados de faturamento e operação.",
        "Construí pipelines de CI/CD com GitHub Actions em várias aplicações Node.js.",
      ],
    },
    btg: {
      period: "07/2021 – 07/2025",
      location: "São Paulo, Brasil (remoto)",
      achievements: [
        "Desenvolvi aplicações web React com pipelines Azure, CI/CD Jenkins e Scrum/Kanban.",
        "Escrevi testes unitários e de integração com Jest, testes end-to-end com Cypress e usei Storybook para a biblioteca de componentes e o design system.",
        "Usei React Query para melhorar a velocidade das requisições e o cache; pratiquei TDD e Clean Architecture.",
        "Atuei em Azure e AWS com infraestrutura como código (CloudFormation), Aurora DB, SQS, SNS e Lambda.",
      ],
    },
    insight: {
      period: "09/2020 – 07/2021",
      location: "Fortaleza, Brasil (remoto)",
      achievements: [
        "Construí aplicações web para o governo estadual com React, um style guide e visualizações de mapas com Leaflet.",
        "Criei rotinas de CI/CD no GitLab e utilizei recursos da AWS como EC2.",
        "Construí uma API REST com Spring Boot e MongoDB Atlas, incluindo modelagem de domínio e arquitetura.",
        "Adicionei testes unitários ao back-end e testes end-to-end com Cypress ao front-end.",
      ],
    },
    "medical-devices": {
      period: "10/2020 – 12/2020",
      location: "Fortaleza, Brasil (remoto, meio período)",
      achievements: [
        "Construí uma aplicação React usando Redux.",
        "Construí uma API web em Ruby on Rails integrada a gateways de pagamento como o Pagar.me.",
      ],
    },
    gti: {
      period: "06/2019 – 09/2020",
      location: "Fortaleza, Brasil (remoto, meio período voluntário)",
      achievements: [
        "Construí aplicações web com Ruby on Rails, PostgreSQL e integrações com gateways de pagamento.",
        "Construí sites com WordPress.",
      ],
    },
  },
  skillGroups: {
    frontend: "Frontend",
    backend: "Backend",
    data: "Dados",
    cloud: "Cloud",
    practices: "Práticas",
    ai: "IA",
  },
  projects: {
    "invoice-pipeline": {
      description:
        "Fluxo assíncrono de extração de faturas com IA para uma plataforma de faturamento de energia, construído com filas e funções serverless.",
    },
    observability: {
      description:
        "Rastreamento, métricas e logs em microsserviços com OpenTelemetry e a stack LGTM.",
    },
    integrations: {
      description:
        "Processos ETL que sincronizam dados de faturamento e operação entre várias plataformas externas.",
    },
  },
  takeaways: {
    testability: {
      title: "Projete para testabilidade primeiro",
      detail:
        "SOLID, Clean Architecture e TDD transformam código com cara de legado em módulos que podem ser testados unitariamente, como na refatoração do leitor de faturas.",
    },
    "async-slow-work": {
      title: "Assíncrono por padrão para trabalho lento",
      detail:
        "Filas, funções serverless e armazenamento de objetos mantêm a extração com IA e as integrações resilientes e escaláveis.",
    },
    observability: {
      title: "Observe antes de supor",
      detail:
        "Logs, traces e métricas (Datadog, Elastic, OpenTelemetry, LGTM) encurtam o caminho entre o incidente e a causa raiz.",
    },
    pipeline: {
      title: "Automatize o pipeline",
      detail:
        "CI/CD no Azure DevOps e GitHub Actions, mais testes end-to-end com Cypress, pegam regressões antes dos usuários.",
    },
    "server-state": {
      title: "Estado de servidor não é estado global",
      detail:
        "React Query para dados do servidor e Zustand para estado do cliente mantêm as interfaces rápidas e fáceis de manter.",
    },
  },
};
