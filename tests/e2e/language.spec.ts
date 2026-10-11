import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { en as dictEn } from "../../src/lib/dictionaries/en";
import { pt as dictPt } from "../../src/lib/dictionaries/pt";

const SECTION_IDS = ["user", "experience", "skills", "projects", "takeaways", "contact"];
const THEMES = "warm | gruvbox | dracula | nord | monokai | solarized";

const prompt = (page: Page) => page.getByRole("textbox", { name: /^(Command|Comando)$/ });
const output = (page: Page) => page.locator('[role="log"]');

/** After a language switch: the new URL, then the page hydrated enough to type in. */
async function arrived(page: Page, url: RegExp) {
  await expect(page).toHaveURL(url);
  await page.waitForLoadState("networkidle");
}

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

const outputLines = (page: Page) => output(page).locator("p").allInnerTexts();

/** Everything on the page that is read out loud or seen, plus accessible names. */
const pageStrings = (page: Page) =>
  page.evaluate(() => {
    // Scripts hold Next's serialised page data, which is not text a visitor reads.
    const body = document.body.cloneNode(true) as HTMLElement;
    body.querySelectorAll("script, style, noscript").forEach((el) => el.remove());
    const text = body.textContent ?? "";
    const labels = [...document.querySelectorAll("[aria-label]")].map(
      (el) => el.getAttribute("aria-label") ?? "",
    );
    return [text, ...labels].join("\n");
  });

type Facts = Awaited<ReturnType<typeof facts>>;

/** The content of both pages in one shape, for comparing the two languages. */
const facts = (page: Page) =>
  page.evaluate(() => {
    const text = (el: Element | null | undefined) => el?.textContent?.trim() ?? "";
    const all = (sel: string, root: ParentNode = document) => [...root.querySelectorAll(sel)];
    return {
      experience: all("#experience ol > li").map((li) => {
        const [whoWhere, period] = all("p", li);
        const [company, location = ""] = text(whoWhere).split("|").map((s) => s.trim());
        return {
          role: text(li.querySelector("h3")),
          company,
          location,
          period: text(period),
          achievements: all("ul.list-disc > li", li).map(text),
          stack: all("ul[aria-label] > li", li).map(text),
        };
      }),
      skillGroups: all("#skills h3").map(text),
      skills: all("#skills li").map((li) => ({
        label: text(li.querySelector("span")),
        bar: text(li.querySelector('[data-testid="skill-bar"]')),
      })),
      projects: all("#projects > div > ul > li").map((li) => ({
        name: text(li.querySelector("h3")?.firstChild as Element),
        stars: text(li.querySelector("h3 span")),
        description: text(li.querySelector("p")),
        stack: all("ul[aria-label] > li", li).map(text),
        link: li.querySelector("a")?.getAttribute("href") ?? "",
      })),
      takeaways: all("#takeaways li").map((li) => ({
        title: text(li.querySelector("h3")),
        detail: text(li.querySelector("p")),
      })),
      contact: all("#contact li").map((li) => ({
        label: text(li.querySelector("span")),
        value: text(li.querySelector("a")),
        href: li.querySelector("a")?.getAttribute("href") ?? "",
        download: li.querySelector("a")?.getAttribute("download") ?? "",
      })),
      identity: {
        name: text(document.querySelector("#user h2")),
        title: text(document.querySelector("#user h2 + p")),
        tags: all("#user ul[aria-label] > li").map(text),
        dd: all("#user dd").map(text),
        bio: all("#user p.text-on-surface-variant").map(text),
      },
    };
  });

async function open(page: Page, url: string): Promise<Facts> {
  await page.goto(url, { waitUntil: "networkidle" });
  return facts(page);
}

test.describe("locale", () => {
  test("[C1] / answers 200 in English with page language en", async ({ page }) => {
    const res = await page.goto("/");
    expect(res!.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByText("Macro Registers:")).toBeVisible();
    await expect(page.locator("#experience h2")).toHaveText("Experience");
    await expect(page.locator("h1")).toHaveText("Natan Moreira — Software Engineer");
    await expect(page.locator("#user")).toContainText("years of experience");
    await expect(page.locator("#contact")).toContainText("Download CV");
    expect(await page.locator("section[id]").count()).toBe(6);
  });

  test("[C2] /pt answers 200 with page language pt-BR and one h1 naming the owner", async ({
    page,
  }) => {
    const res = await page.goto("/pt");
    expect(res!.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Natan Moreira");
  });

  test("[C3] /pt/anything answers 404", async ({ page }) => {
    const res = await page.goto("/pt/anything");
    expect(res!.status()).toBe(404);
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("[C4] /pt keeps the six sections in order with English command labels", async ({
      page,
    }) => {
      await page.goto("/pt");
      const ids = await page
        .locator("section[id]")
        .evaluateAll((els) => els.map((el) => el.id));
      expect(ids).toEqual(SECTION_IDS);
      for (const id of SECTION_IDS) {
        await expect(page.locator(`section#${id}`)).toContainText(`[CMD: /${id}]`);
        await expect(page.locator(`section#${id}`)).toBeVisible();
      }
    });
  });
});

test.describe("content", () => {
  test("[C6] /pt identity is Portuguese, with the English title and neutral wording", async ({
    page,
  }) => {
    const en = await open(page, "/");
    const pt = await open(page, "/pt");
    expect(pt.identity.name).toBe(en.identity.name);
    expect(pt.identity.tags).toEqual(en.identity.tags);
    expect(pt.identity.title).toBe("Software Engineer");
    expect(pt.identity.dd).toEqual(["Fortaleza, Brasil", "Remoto — Senior Frontend Engineer na Hapvida"]);
    expect(pt.identity.bio).toHaveLength(en.identity.bio.length);
    expect(pt.identity.bio[0]).toContain("anos de experiência");
    expect(pt.identity.bio[0]).not.toContain("years of experience");
    expect(pt.identity.bio.join(" ")).not.toMatch(
      /\b(apaixonad[oa]|comprometid[oa]|dedicad[oa]|motivad[oa])\b/i,
    );
  });

  test("[C7] /pt experience matches / entry by entry and is Portuguese text", async ({
    page,
  }) => {
    const en = await open(page, "/");
    const pt = await open(page, "/pt");
    expect(pt.experience).toHaveLength(en.experience.length);
    pt.experience.forEach((entry, i) => {
      const source = en.experience[i];
      expect(entry.role).toBe(source.role);
      expect(entry.company).toBe(source.company);
      expect(entry.stack).toEqual(source.stack);
      expect(entry.achievements).toHaveLength(source.achievements.length);
      expect(entry.location).not.toBe(source.location);
      entry.achievements.forEach((a, j) => expect(a).not.toBe(source.achievements[j]));
    });
    expect(pt.experience[0].period).toBe("07/2025 – Atual");
    expect(en.experience[0].period).toBe("07/2025 – Present");
    expect(pt.experience[0].achievements[0]).toMatch(/^Construo e mantenho/);
    expect(pt.experience[1].achievements[0]).toMatch(/^Construí/);
  });

  test("[C8] /pt skills match / and the groups are named in Portuguese", async ({
    page,
  }) => {
    const en = await open(page, "/");
    const pt = await open(page, "/pt");
    expect(en.skillGroups).toEqual(["Frontend", "Backend", "Data", "Cloud", "Practices", "AI"]);
    expect(pt.skillGroups).toEqual(["Frontend", "Backend", "Dados", "Cloud", "Práticas", "IA"]);
    expect(pt.skills).toEqual(en.skills);
    expect(pt.skills.length).toBeGreaterThan(0);
  });

  test("[C9] /pt projects, takeaways and contact match / apart from the prose", async ({
    page,
  }) => {
    const en = await open(page, "/");
    const pt = await open(page, "/pt");
    expect(pt.projects).toHaveLength(en.projects.length);
    pt.projects.forEach((p, i) => {
      expect({ ...p, description: "" }).toEqual({ ...en.projects[i], description: "" });
      expect(p.description).not.toBe(en.projects[i].description);
    });
    expect(pt.takeaways).toHaveLength(en.takeaways.length);
    expect(pt.takeaways.map((t) => t.title)).toEqual([
      "Projete para testabilidade primeiro",
      "Assíncrono por padrão para trabalho lento",
      "Observe antes de supor",
      "Automatize o pipeline",
      "Estado de servidor não é estado global",
    ]);
    expect(en.takeaways.map((t) => t.title)).toEqual([
      "Design for testability first",
      "Async by default for slow work",
      "Observe before you guess",
      "Automate the pipeline",
      "Server state is not global state",
    ]);
    pt.takeaways.forEach((t, i) => {
      expect(t.title).not.toBe(en.takeaways[i].title);
      expect(t.detail).not.toBe(en.takeaways[i].detail);
    });
    expect(pt.contact.slice(0, -1)).toEqual(en.contact.slice(0, -1));
  });

  test("[C10] /pt CV link has the same target and download name and reads in Portuguese", async ({
    page,
  }) => {
    const en = await open(page, "/");
    const pt = await open(page, "/pt");
    const enCv = en.contact.at(-1)!;
    const ptCv = pt.contact.at(-1)!;
    expect(ptCv.href).toBe(enCv.href);
    expect(ptCv.download).toBe(enCv.download);
    expect(ptCv.value).toBe(`Baixar CV em inglês (${enCv.download})`);
    expect(enCv.value).toBe(`Download CV (${enCv.download})`);
  });

  test("[C11] /pt section counters equal the line count and UTF-8 bytes of the text", async ({
    page,
  }) => {
    const f = await open(page, "/pt");
    const lines: Record<string, string[]> = {
      user: [
        `name: ${f.identity.name}`,
        `title: ${f.identity.title}`,
        `tags: ${f.identity.tags.map((t) => t.replace(/^#/, "")).join(", ")}`,
        `location: ${f.identity.dd[0]}`,
        `status: ${f.identity.dd[1]}`,
        ...f.identity.bio,
      ],
      experience: f.experience.flatMap((e) => [
        `${e.role} @ ${e.company}`,
        `${e.period} | ${e.location}`,
        ...e.achievements.map((a) => `- ${a}`),
        `stack: ${e.stack.join(", ")}`,
      ]),
      skills: f.skills.map((s, i) => {
        const group = f.skillGroups[[0, 5, 9, 12, 15, 19].filter((start) => start <= i).length - 1];
        return `${group}/${s.label} ${s.bar}`;
      }),
      projects: f.projects.flatMap((p) => [p.name, p.description, `stack: ${p.stack.join(", ")}`, p.link]),
      takeaways: f.takeaways.map((t) => `${t.title}: ${t.detail}`),
      contact: [
        ...f.contact.slice(0, -1).map((c) => `${c.label}: ${c.value}`),
        `cv: ${f.contact.at(-1)!.download}`,
      ],
    };
    let accented = 0;
    for (const id of SECTION_IDS) {
      const counter = await page
        .locator(`section#${id} span[aria-hidden="true"]`)
        .last()
        .textContent();
      const [, l, b] = counter!.match(/(\d+)L, (\d+)B/)!;
      expect(Number(l), id).toBe(lines[id].length);
      const bytes = Buffer.byteLength(lines[id].join("\n"), "utf8");
      expect(Number(b), id).toBe(bytes);
      if (bytes > lines[id].join("\n").length) accented++;
    }
    expect(accented).toBeGreaterThan(0);
  });

  test("[C13] values that are not translatable are identical on / and /pt", async ({
    page,
  }) => {
    const en = await open(page, "/");
    const pt = await open(page, "/pt");
    expect(pt.skills).toEqual(en.skills);
    expect(pt.experience.map((e) => [e.company, e.role, e.stack])).toEqual(
      en.experience.map((e) => [e.company, e.role, e.stack]),
    );
    expect(pt.projects.map((p) => [p.name, p.stack, p.link, p.stars])).toEqual(
      en.projects.map((p) => [p.name, p.stack, p.link, p.stars]),
    );
    expect(pt.contact.slice(0, -1)).toEqual(en.contact.slice(0, -1));
  });
});

test.describe("interface text", () => {
  const leaves = (value: unknown): string[] =>
    typeof value === "string"
      ? [value]
      : Object.values(value as object).flatMap(leaves);
  const flat = (dict: unknown, prefix = ""): Record<string, string> =>
    Object.fromEntries(
      Object.entries(dict as object).flatMap(([k, v]) =>
        typeof v === "string"
          ? [[`${prefix}${k}`, v]]
          : Object.entries(flat(v, `${prefix}${k}.`)),
      ),
    );

  test("[C14] /pt shows no English interface string and keeps terminal tokens", async ({
    page,
  }) => {
    await page.goto("/pt", { waitUntil: "networkidle" });
    const shown = await pageStrings(page);
    const enFlat = flat(dictEn);
    const ptFlat = flat(dictPt);
    expect(leaves(dictEn).length).toBeGreaterThan(40);
    const english = Object.entries(enFlat).filter(
      ([key, value]) =>
        value !== ptFlat[key] && !value.includes("{") && value.split(/\s+/).length >= 3,
    );
    expect(english.length).toBeGreaterThan(10);
    for (const [key, value] of english) {
      expect(shown, key).not.toContain(value);
    }
    // Placeholder entries (`{lines}`, `{file}`...) are matched as patterns, so
    // the sr-only frame counts cannot silently stay English.
    const patterns = Object.entries(enFlat).filter(
      ([key, value]) => value !== ptFlat[key] && /\{\w+\}/.test(value),
    );
    expect(patterns.length).toBeGreaterThan(5);
    for (const [key, value] of patterns) {
      const source = value
        .split(/\{\w+\}/)
        .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join(".+?");
      expect(shown, key).not.toMatch(new RegExp(source));
    }
    // Short entries (under 3 words) are matched as whole words anywhere on the
    // page. Two are allowed because the English word occurs in other text:
    // "Stack" is part of the technology name "Elastic Stack", and the connective
    // "or" is covered by the positive check on the Portuguese intro below, and
    // "system" occurs in the content ("design system"); the Tab suggestion kinds
    // have their own test.
    const allowedShort = new Set(["sections.stack", "hero.intro.or", "terminal.kinds.system"]);
    const shortEnglish = Object.entries(enFlat).filter(
      ([key, value]) =>
        value !== ptFlat[key] &&
        !/\{\w+\}/.test(value) &&
        value.trim().split(/\s+/).length < 3 &&
        !allowedShort.has(key),
    );
    expect(shortEnglish.length).toBeGreaterThan(5);
    for (const [key, value] of shortEnglish) {
      const word = value.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      expect(shown, key).not.toMatch(new RegExp(`(^|[^\\p{L}\\d])${word}($|[^\\p{L}\\d])`, "u"));
    }
    await expect(page.getByText("Execute comandos começando com / ou :, ou acione buffers rápidos")).toBeVisible();
    // Labelled regions carry Portuguese names.
    await expect(page.getByRole("region", { name: "Registro de inicialização da sessão" })).toBeVisible();
    await expect(page.getByRole("log", { name: "Saída dos comandos" })).toBeAttached();
    await expect(page.getByRole("textbox", { name: "Comando" })).toBeVisible();
    expect(await page.locator('ul[aria-label="Tecnologias"]').count()).toBeGreaterThan(0);
    expect(await page.locator('ul[aria-label="Etiquetas"]').count()).toBeGreaterThan(0);
    // Terminal tokens are identical to the English page.
    const tokens = shown;
    for (const token of [
      "NORMAL",
      "UTF-8",
      "VIM 9.1",
      "BUF #1",
      "[RO]",
      "guest@portfolio:~$",
      "NODE: node-01a.sfo3",
      "BAUD: 38400 | ARCH: x86_64-retro | TERM: xterm-256color",
      "EXEC",
      "[SYSTEM]:",
      "[OK]",
      "profile.vim",
      "⎇ main",
    ]) {
      expect(tokens, token).toContain(token);
    }
    // Decorative phrases are translated.
    await expect(page.getByText("TERMINAL DE HARDWARE COMPATÍVEL COM VT220")).toBeVisible();
    expect(tokens).toContain("0 erros 0 avisos");
    expect(tokens).toContain("[INICIALIZAÇÃO DA SESSÃO: 0.0014s]");
    expect(tokens).not.toContain("SESSION BOOT");
    // COMMAND shows while the prompt is focused; the cv label is a token too.
    await prompt(page).focus();
    await expect(page.getByTestId("mode")).toHaveText("COMMAND");
    await expect(page.locator("#contact").getByText("cv", { exact: true })).toBeVisible();
  });

  test("[C14] only the intended tokens are identical in both dictionaries", () => {
    // An entry that is the same in both languages is skipped by the page checks
    // above, so the allowed ones are pinned here: any other entry that drifts
    // back to English fails this list.
    const identical = Object.keys(flat(dictEn)).filter(
      (key) => flat(dictEn)[key] === flat(dictPt)[key],
    );
    expect(identical.sort()).toEqual(["prompt.exec", "sections.status"]);
  });

  test("[C14] Tab suggestions on /pt name their kinds in Portuguese", async ({ page }) => {
    await page.goto("/pt", { waitUntil: "networkidle" });
    await prompt(page).fill("/");
    await prompt(page).press("Tab");
    const line = (await outputLines(page)).at(-1)!;
    expect(line).toContain("/user (seção)");
    expect(line).toContain("/language (ação)");
    expect(line).toContain("/help (sistema)");
    expect(line).not.toMatch(/\((section|action|system)\)/);
  });

  test("[C15] /help on /pt lists every command with its Portuguese description", async ({
    page,
  }) => {
    await page.goto("/pt", { waitUntil: "networkidle" });
    await exec(page, "/help");
    const lines = await outputLines(page);
    expect(lines[0]).toContain("/help");
    expect(lines[1]).toBe("Comandos disponíveis:");
    const commandLines = lines.slice(2);
    expect(commandLines).toHaveLength(13);
    const expected: [string, string][] = [
      ["/user", "Mostrar o resumo de identidade"],
      ["/experience", "Mostrar a linha do tempo da experiência"],
      ["/skills", "Mostrar a matriz de habilidades"],
      ["/projects", "Mostrar projetos selecionados"],
      ["/contact", "Mostrar links de contato e o CV"],
      ["/takeaways", "Mostrar os principais aprendizados"],
      [":theme, /theme", "Listar ou trocar temas de cor (:theme [nome])"],
      ["/language, :language", "Listar ou trocar o idioma (/language [en|pt])"],
      ["/help", "Listar todos os comandos disponíveis"],
      ["/clear, :c", "Reiniciar a saída para o cartão de inicialização"],
      ["/music, :music", "abrir o player da playlist do Spotify"],
      [":w", "Baixar o CV"],
      [":q", "Tentar sair (boa sorte)"],
    ];
    expected.forEach(([names, description], i) => {
      expect(commandLines[i]).toContain(names);
      expect(commandLines[i]).toContain(description);
    });
  });

  test("[C16] unknown input on /pt prints a Portuguese E492 message and hint", async ({
    page,
  }) => {
    await page.goto("/pt", { waitUntil: "networkidle" });
    await exec(page, "foo");
    const lines = await outputLines(page);
    expect(lines[0]).toBe("guest@portfolio:~$ foo");
    expect(lines[1].startsWith("E492:")).toBe(true);
    expect(lines[1].endsWith("foo")).toBe(true);
    expect(lines[1]).toContain("Comando de editor desconhecido");
    expect(lines[2]).toContain("/help");
    expect(lines[2]).toContain("Tente");
  });

  const sections = [
    ["user", "Aberto: identidade", "~/.terminal/user.json"],
    ["experience", "Aberto: linha do tempo da experiência", "~/.terminal/experience.log"],
    ["skills", "Aberta: matriz de habilidades", "~/.terminal/skills.json"],
    ["projects", "Abertos: projetos", "~/.terminal/projects.md"],
    ["contact", "Aberto: contato", "~/.terminal/contact.txt"],
    ["takeaways", "Abertos: aprendizados", "~/.terminal/takeaways.md"],
  ] as const;

  test("[C17] each section command on /pt scrolls, highlights and prints a Portuguese result", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/pt", { waitUntil: "networkidle" });
    for (const [id, text, file] of sections) {
      await exec(page, `/${id}`);
      await expect(page.locator(`section#${id}`)).toHaveAttribute("data-highlight", "true");
      await expect(page.locator(`section#${id}`)).toBeInViewport();
      const lines = await outputLines(page);
      expect(lines.at(-1), id).toBe(`${text} → ${file}`);
    }
  });

  test("[C17] the section chips on /pt print the same Portuguese result lines", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/pt", { waitUntil: "networkidle" });
    for (const [id, text, file] of sections.filter(([id]) =>
      ["user", "experience", "skills", "projects"].includes(id),
    )) {
      await page.getByRole("button", { name: new RegExp(`^\\[/${id}\\]`) }).click();
      await expect(page.locator(`section#${id}`)).toHaveAttribute("data-highlight", "true");
      expect((await outputLines(page)).at(-1), id).toBe(`${text} → ${file}`);
    }
  });

  test("[C18] :w, :q and :theme on /pt answer in Portuguese", async ({ page }) => {
    await page.goto("/pt", { waitUntil: "networkidle" });
    const download = page.waitForEvent("download");
    await exec(page, ":w");
    await download;
    await exec(page, ":q");
    await exec(page, ":theme");
    await exec(page, ":theme nord");
    await exec(page, ":theme xx");
    const lines = (await outputLines(page)).filter((l) => !l.startsWith("guest@"));
    expect(lines[0]).toBe('"Natanael_Moreira_Resume.pdf" gravado (download do CV iniciado)');
    expect(lines[1].startsWith("E37:")).toBe(true);
    expect(lines[1]).toContain("somente leitura");
    expect(lines[2]).toBe(`temas: ${THEMES}`);
    expect(lines[3]).toBe("ativo: warm");
    expect(lines[4]).toBe("Tema alterado para nord");
    expect(lines[5]).toBe("E474: Tema desconhecido: xx");
    expect(lines[6]).toBe(`Temas válidos: ${THEMES}`);
  });

  test("[C19] the 7 chips on /pt keep their command names and change their captions", async ({
    page,
  }) => {
    const chips = async (url: string) => {
      await page.goto(url, { waitUntil: "networkidle" });
      const texts = await page
        .getByRole("button", { name: /^\[\/(user|experience|skills|projects|theme|help|clear)\]/ })
        .allInnerTexts();
      return texts.map((t) => {
        const [, name, caption] = t.replace(/\s+/g, " ").match(/^(\[[^\]]+\]) (.+)$/)!;
        return { name, caption };
      });
    };
    const en = await chips("/");
    const pt = await chips("/pt");
    expect(en).toHaveLength(7);
    expect(pt.map((c) => c.name)).toEqual(en.map((c) => c.name));
    pt.forEach((c, i) => expect(c.caption).not.toBe(en[i].caption));
  });
});

test.describe("language switch", () => {
  const scrollSectionToTop = (page: Page, id: string) =>
    page.evaluate((target) => {
      const top = document.getElementById(target)!.getBoundingClientRect().top;
      window.scrollTo({ top: window.scrollY + top, behavior: "instant" });
    }, id);

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test("[C20] switching from a section opens the other language at its top, with no fragment", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await scrollSectionToTop(page, "skills");
    await page.getByRole("link", { name: "Português" }).click();
    await arrived(page, /\/pt$/);
    expect(new URL(page.url()).hash).toBe("");
    expect(await page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
    await scrollSectionToTop(page, "skills");
    await page.getByRole("link", { name: "English" }).click();
    await arrived(page, /:\d+\/$/);
    expect(new URL(page.url()).hash).toBe("");
    expect(await page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1);
  });

  test("[C21] with JavaScript the toggle link is the bare route of the other language", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: "Português" })).toHaveAttribute("href", "/pt");
    await page.goto("/pt", { waitUntil: "networkidle" });
    await expect(page.getByRole("link", { name: "English" })).toHaveAttribute("href", "/");
  });

  test.describe("without JavaScript", () => {
    test.use({ javaScriptEnabled: false });

    test("[C22] the other language is a plain link to its route", async ({ page }) => {
      await page.goto("/");
      const toPt = page.getByRole("link", { name: "Português" });
      await expect(toPt).toHaveAttribute("href", "/pt");
      await toPt.click();
      await expect(page).toHaveURL(/\/pt$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
      const toEn = page.getByRole("link", { name: "English" });
      await expect(toEn).toHaveAttribute("href", "/");
      await toEn.click();
      await expect(page).toHaveURL(/:\d+\/$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
    });
  });

  test("[C23] /language and :language switch to the other route", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await exec(page, "/language pt");
    await arrived(page, /\/pt$/);
    await exec(page, "/language en");
    await arrived(page, /:\d+\/$/);
    await exec(page, ":language pt");
    await arrived(page, /\/pt$/);
    await exec(page, ":language en");
    await arrived(page, /:\d+\/$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("[C24] /language lists the languages and the active one", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await exec(page, "/language");
    expect((await outputLines(page)).slice(1)).toEqual(["languages: en | pt", "active: en"]);
    await page.goto("/pt", { waitUntil: "networkidle" });
    await exec(page, "/language");
    expect((await outputLines(page)).slice(1)).toEqual(["idiomas: en | pt", "ativo: pt"]);
  });

  test("[C25] /language with an unknown name explains the options and stays put", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await exec(page, "/language xx");
    expect((await outputLines(page)).slice(1)).toEqual([
      "E474: Unknown language: xx",
      "Valid languages: en | pt",
    ]);
    await expect(page).toHaveURL(/:\d+\/$/);
    await page.goto("/pt", { waitUntil: "networkidle" });
    await exec(page, "/language xx");
    expect((await outputLines(page)).slice(1)).toEqual([
      "E474: Idioma desconhecido: xx",
      "Idiomas válidos: en | pt",
    ]);
    await expect(page).toHaveURL(/\/pt$/);
  });

  test("[C26] /language naming the active language says so and does not navigate", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await exec(page, "/language en");
    expect((await outputLines(page)).slice(1)).toEqual(["Already using English"]);
    await expect(page).toHaveURL(/:\d+\/$/);
    await page.goto("/pt", { waitUntil: "networkidle" });
    await exec(page, "/language pt");
    expect((await outputLines(page)).slice(1)).toEqual(["Já está em Português"]);
    await expect(page).toHaveURL(/\/pt$/);
  });

  test("[C27] a saved theme is applied on the target page before first paint", async ({
    page,
  }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "nord"));
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: "Português" }).click();
    await expect(page).toHaveURL(/\/pt$/);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "nord");
    // With the page's scripts blocked, only the inline head script can have set it.
    await page.route("**/_next/static/**", (route) => route.abort());
    await page.goto("/pt", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "nord");
  });

  test("[C28] switching discards the output and the prompt history", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    await exec(page, "/help");
    expect((await outputLines(page)).length).toBeGreaterThan(0);
    await page.getByRole("link", { name: "Português" }).click();
    await expect(page).toHaveURL(/\/pt$/);
    await page.waitForLoadState("networkidle");
    expect(await outputLines(page)).toEqual([]);
    await expect(
      page.getByRole("region", { name: "Registro de inicialização da sessão" }),
    ).toBeVisible();
    await prompt(page).press("ArrowUp");
    await expect(prompt(page)).toHaveValue("");
  });

  test("[C29] the EN | PT toggle sits at the top of the hero and is accessible", async ({ page }) => {
    for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    for (const [url, active, other, name, lang] of [
      ["/", "EN", "PT", "Português", "pt-BR"],
      ["/pt", "PT", "EN", "English", "en"],
    ] as const) {
      await page.goto(url, { waitUntil: "networkidle" });
      const hero = page.locator("main header").first();
      const toggle = hero.getByRole("navigation", { name: /^(Language|Idioma)$/ });
      await expect(toggle).toBeVisible();
      // At the top-right of the hero card: near its top edge, and not among the chips.
      const card = hero.locator(":scope > div").nth(1);
      const cardBox = (await card.boundingBox())!;
      const toggleBox = (await toggle.boundingBox())!;
      expect(toggleBox.y - cardBox.y).toBeLessThan(40);
      expect(cardBox.x + cardBox.width - (toggleBox.x + toggleBox.width)).toBeLessThan(40);
      const chip = (await hero.getByRole("button", { name: /^\[\/help\]/ }).boundingBox())!;
      expect(toggleBox.y + toggleBox.height).toBeLessThan(chip.y);
      await expect(toggle.getByRole("listitem")).toHaveText(["EN", "PT"]);
      const current = toggle.locator('[aria-current="true"]');
      await expect(current).toHaveText(active);
      expect(await current.evaluate((el) => el.tagName)).toBe("SPAN");
      const link = toggle.getByRole("link", { name });
      await expect(link).toHaveText(other);
      await expect(link).toHaveAttribute("lang", lang);
      await expect(toggle.getByRole("link")).toHaveCount(1);
      if (width === 375) {
        expect((await current.boundingBox())!.height).toBeGreaterThanOrEqual(44);
        expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      }
      // Reach the link by keyboard and read its focus outline.
      let focused = false;
      for (let i = 0; i < 40 && !focused; i++) {
        await page.keyboard.press("Tab");
        focused = await link.evaluate((el) => el === document.activeElement);
      }
      expect(focused).toBe(true);
      const outline = await link.evaluate((el) => {
        const s = getComputedStyle(el);
        return { width: parseFloat(s.outlineWidth), style: s.outlineStyle };
      });
      expect(outline.style).not.toBe("none");
      expect(outline.width).toBeGreaterThanOrEqual(2);
    }
    }
  });
});

test.describe("metadata", () => {
  const head = async (page: Page, url: string) => {
    await page.goto(url);
    const attr = (selector: string, name: string) =>
      page.locator(selector).first().getAttribute(name);
    return {
      title: await page.title(),
      description: await attr('meta[name="description"]', "content"),
      canonical: new URL((await attr('link[rel="canonical"]', "href"))!).pathname,
      en: new URL((await attr('link[rel="alternate"][hreflang="en"]', "href"))!).pathname,
      pt: new URL((await attr('link[rel="alternate"][hreflang="pt-BR"]', "href"))!).pathname,
      og: new URL((await attr('meta[property="og:image"]', "content"))!).pathname,
      twitter: new URL((await attr('meta[name="twitter:image"]', "content"))!).pathname,
    };
  };

  test("[C30] / has its title, canonical address and both alternates", async ({ page }) => {
    const h = await head(page, "/");
    expect(h.title).toBe("Natan Moreira — Software Engineer");
    expect(h.canonical).toBe("/");
    expect([h.en, h.pt]).toEqual(["/", "/pt"]);
  });

  test("[C31] /pt has a Portuguese description, its own canonical address and both alternates", async ({
    page,
  }) => {
    const h = await head(page, "/pt");
    expect(h.title).toBe("Natan Moreira — Software Engineer");
    expect(h.description).toContain("Natan Moreira");
    expect(h.description).toContain("experiência");
    expect(h.canonical).toBe("/pt");
    expect([h.en, h.pt]).toEqual(["/", "/pt"]);
  });

  test("[C32] each page's social images resolve and /pt has its own route", async ({
    page,
    request,
  }) => {
    const en = await head(page, "/");
    const pt = await head(page, "/pt");
    expect(pt.og).not.toBe(en.og);
    for (const h of [en, pt]) {
      expect(h.twitter).toBe(h.og);
      const res = await request.get(h.og);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });
});

test.describe("docs", () => {
  test("[C36] README documents where each language lives, /pt and /language", async () => {
    const readme = fs.readFileSync(path.join(__dirname, "../../README.md"), "utf8");
    const section = readme.split(/^## /m).find((s) => s.startsWith("Edit the content"))!;
    expect(section).toContain("src/content/en.ts");
    expect(section).toContain("src/content/pt.ts");
    expect(section).toContain("src/content/shared.ts");
    expect(section).toContain("src/lib/dictionaries/en.ts");
    expect(section).toContain("src/lib/dictionaries/pt.ts");
    expect(section).toContain("/pt");
    expect(section).toContain("/language");
    expect(readme).not.toMatch(/keeps the section/i);
  });
});
