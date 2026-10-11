import type { Dictionary } from "../dictionary";

export const pt: Dictionary = {
  site: {
    description:
      "Portfólio pessoal de Natan Moreira, Software Engineer: experiência, habilidades, projetos e principais aprendizados.",
  },
  hero: {
    hardware: "TERMINAL DE HARDWARE COMPATÍVEL COM VT220 [EMULAÇÃO 80x25]",
    ready: "TTY1 PRONTO",
    intro: {
      before:
        "Sessão de espaço de trabalho modal iniciada. Execute comandos começando com ",
      or: " ou ",
      after: ", ou acione buffers rápidos nos registradores de macro abaixo.",
    },
    macroRegisters: "Registradores de macro:",
  },
  language: { navLabel: "Idioma" },
  boot: {
    regionLabel: "Registro de inicialização da sessão",
    sessionBoot: "[INICIALIZAÇÃO DA SESSÃO: 0.0014s]",
    system:
      "[SYSTEM]: Kernel v6.8.9-x86_64 carregado. Sessão com privilégio de convidado estabelecida.",
    help: {
      before: "Digite ",
      after:
        " ou pressione qualquer chip de macro acima para exibir o buffer do sistema. Todos os comandos são não destrutivos no modo de sessão de convidado.",
    },
  },
  prompt: { label: "Comando", exec: "EXEC", clear: "LIMPAR" },
  output: { label: "Saída dos comandos" },
  statusline: { diagnostics: "✓ 0 erros 0 avisos" },
  sections: {
    experience: "Experiência",
    skills: "Habilidades",
    projects: "Projetos",
    takeaways: "Principais aprendizados",
    contact: "Contato",
    stack: "Tecnologias",
    tags: "Etiquetas",
    location: "localização",
    status: "status",
    photoPlaceholder: "TODO: foto do proprietário",
    downloadCv: "Baixar CV em inglês ({file})",
    spotifyPlaylist: "Playlist no Spotify",
    frameCounts: "{lines} linhas, {bytes} bytes",
  },
  terminal: {
    helpHeading: "Comandos disponíveis:",
    cvWritten: '"{file}" gravado (download do CV iniciado)',
    quit: "E37: Nenhuma gravação desde a última alteração. Este buffer é somente leitura e a página não vai a lugar nenhum — tente :w.",
    themes: "temas: {themes}",
    themeActive: "ativo: {theme}",
    themeSet: "Tema alterado para {theme}",
    unknownTheme: "E474: Tema desconhecido: {name}",
    validThemes: "Temas válidos: {themes}",
    unknownCommand: "E492: Comando de editor desconhecido: {input}",
    unknownHint: "Tente /help para ver a lista de comandos.",
    languages: "idiomas: {languages}",
    languageActive: "ativo: {language}",
    unknownLanguage: "E474: Idioma desconhecido: {name}",
    validLanguages: "Idiomas válidos: {languages}",
    languageAlready: "Já está em {language}",
    kinds: { section: "seção", action: "ação", system: "sistema" },
  },
  commands: {
    "/user": {
      description: "Mostrar o resumo de identidade",
      result: "Aberto: identidade → ~/.terminal/user.json",
      chip: "identidade",
    },
    "/experience": {
      description: "Mostrar a linha do tempo da experiência",
      result: "Aberto: linha do tempo da experiência → ~/.terminal/experience.log",
      chip: "histórico",
    },
    "/skills": {
      description: "Mostrar a matriz de habilidades",
      result: "Aberta: matriz de habilidades → ~/.terminal/skills.json",
      chip: "matriz",
    },
    "/projects": {
      description: "Mostrar projetos selecionados",
      result: "Abertos: projetos → ~/.terminal/projects.md",
      chip: "pacotes",
    },
    "/contact": {
      description: "Mostrar links de contato e o CV",
      result: "Aberto: contato → ~/.terminal/contact.txt",
    },
    "/takeaways": {
      description: "Mostrar os principais aprendizados",
      result: "Abertos: aprendizados → ~/.terminal/takeaways.md",
    },
    ":theme": {
      description: "Listar ou trocar temas de cor (:theme [nome])",
      chip: "paleta",
    },
    "/language": {
      description: "Listar ou trocar o idioma (/language [en|pt])",
    },
    "/help": { description: "Listar todos os comandos disponíveis", chip: "manual" },
    "/clear": {
      description: "Reiniciar a saída para o cartão de inicialização",
      chip: "limpar",
    },
    ":w": { description: "Baixar o CV" },
    ":q": { description: "Tentar sair (boa sorte)" },
  },
};
