import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { getDictionary } from "@/lib/dictionaries";

const THEMES = ["warm", "gruvbox", "dracula", "nord", "monokai", "solarized"] as const;
const SPOTIFY = /^https:\/\/([^/]+\.)?(spotify\.com|scdn\.co)\//;
const STUB_BODY = "<!doctype html><title>stub</title><body style='background:#1f1f1f;color:#fff'>stub embed";

const languages = [
  {
    code: "en",
    path: "/",
    otherPath: "/pt",
    otherName: "Português",
    command: "/language pt",
    landmark: "Music player",
    closeName: "Close music player",
    iframeTitle: "Spotify playlist: Natan Profile",
    openLink: "open in Spotify ↗",
    error: "Spotify could not be loaded. Use the link above to open the playlist.",
  },
  {
    code: "pt",
    path: "/pt",
    otherPath: "/",
    otherName: "English",
    command: "/language en",
    landmark: "Player de música",
    closeName: "Fechar player de música",
    iframeTitle: "Playlist do Spotify: Natan Profile",
    openLink: "abrir no Spotify ↗",
    error: "Não foi possível carregar o Spotify. Use o link acima para abrir a playlist.",
  },
] as const;

const prompt = (page: Page) => page.locator("#command-prompt");

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

const stubSpotify = (page: Page) =>
  page.route(SPOTIFY, (route) => route.fulfill({ contentType: "text/html", body: STUB_BODY }));

async function useTheme(page: Page, theme: string) {
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
}

const violationsOf = async (page: Page) =>
  (await new AxeBuilder({ page }).analyze()).violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`,
  );

for (const lang of languages) {
  const strip = (page: Page) => page.getByRole("complementary", { name: lang.landmark });

  test.describe(`music player accessibility (${lang.code})`, () => {
    test("the strip is a named aside, the iframe is titled and [x] has an accessible name", async ({
      page,
    }) => {
      await stubSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");

      const aside = strip(page);
      await expect(aside).toBeVisible();
      expect(await aside.evaluate((el) => el.tagName)).toBe("ASIDE");
      await expect(page.locator("iframe")).toHaveAttribute("title", lang.iframeTitle);
      const close = aside.getByRole("button", { name: lang.closeName, exact: true });
      await expect(close).toHaveText("[x]");
      await expect(aside.getByRole("link", { name: lang.openLink, exact: true })).toBeVisible();
      // The page has exactly one complementary landmark: the strip.
      await expect(page.getByRole("complementary")).toHaveCount(1);
    });

    test("the link, [x] and the embed are reachable with Tab and show the 2px focus outline", async ({
      page,
    }) => {
      await stubSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      const aside = strip(page);
      const link = aside.getByRole("link", { name: lang.openLink });
      const close = aside.getByRole("button", { name: lang.closeName });
      const iframe = page.locator("iframe");

      await link.focus();
      await expect(link).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(close).toBeFocused();
      const outline = await close.evaluate((el) => {
        const s = getComputedStyle(el);
        return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
      });
      expect(outline.style).toBe("solid");
      expect(outline.width).toBe("2px");
      expect(outline.color).not.toBe("rgba(0, 0, 0, 0)");

      await page.keyboard.press("Tab");
      await expect(iframe).toBeFocused();
    });

    test("[x] shows the same outline colour as the other controls", async ({ page }) => {
      await stubSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      const close = strip(page).getByRole("button", { name: lang.closeName });
      await close.focus();
      const color = await close.evaluate((el) => getComputedStyle(el).outlineColor);
      const primary = await page.evaluate(() => {
        const probe = document.createElement("i");
        probe.style.color = getComputedStyle(document.documentElement).getPropertyValue(
          "--color-primary",
        );
        document.body.append(probe);
        const resolved = getComputedStyle(probe).color;
        probe.remove();
        return resolved;
      });
      expect(color).toBe(primary);
    });

    for (const theme of THEMES) {
      test(`no axe violations with the strip open in the ${theme} theme`, async ({ page }) => {
        await stubSpotify(page);
        await useTheme(page, theme);
        await page.goto(lang.path, { waitUntil: "networkidle" });
        await exec(page, "/music");
        await expect(strip(page)).toBeVisible();
        await expect(page.frameLocator("iframe").locator("body")).toContainText("stub embed");
        if (theme !== "warm") {
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        }
        expect(await violationsOf(page)).toEqual([]);
      });

      test(`no axe violations at 375px with the strip open in the ${theme} theme`, async ({
        page,
      }) => {
        await stubSpotify(page);
        await useTheme(page, theme);
        await page.setViewportSize({ width: 375, height: 800 });
        await page.goto(lang.path, { waitUntil: "networkidle" });
        await exec(page, "/music");
        await expect(strip(page)).toBeVisible();
        expect(await violationsOf(page)).toEqual([]);
      });

      test(`no axe violations with the blocked-embed error showing in the ${theme} theme`, async ({
        page,
      }) => {
        await page.route(SPOTIFY, (route) => route.abort("failed"));
        await useTheme(page, theme);
        await page.goto(lang.path, { waitUntil: "networkidle" });
        await exec(page, "/music");
        await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });
        expect(await violationsOf(page)).toEqual([]);
      });
    }
  });

  test.describe(`language switch closes the player (${lang.code})`, () => {
    async function trackSpotify(page: Page): Promise<string[]> {
      const urls: string[] = [];
      page.on("request", (request) => {
        if (/(^|\.)(spotify\.com|scdn\.co)$/.test(new URL(request.url()).hostname)) {
          urls.push(request.url());
        }
      });
      return urls;
    }

    async function expectClosedOnOtherPage(page: Page, urls: string[]) {
      const other = languages.find((l) => l.path === lang.otherPath)!;
      await expect(page).toHaveURL((url) => url.pathname === lang.otherPath);
      await page.waitForLoadState("load");
      await expect(page.getByRole("complementary")).toHaveCount(0);
      await expect(page.getByRole("complementary", { name: other.landmark })).toHaveCount(0);
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(page.locator("footer").getByText("♪ music")).toHaveCount(0);
      // The old document is gone and the new one asks Spotify for nothing.
      urls.length = 0;
      await page.waitForTimeout(500);
      expect(urls).toEqual([]);
    }

    test("the EN/PT toggle with the strip open lands on a page with no strip and no iframe", async ({
      page,
    }) => {
      await stubSpotify(page);
      const urls = await trackSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(page.locator("iframe")).toHaveCount(1);

      await page.getByRole("link", { name: lang.otherName, exact: true }).click();
      await expectClosedOnOtherPage(page, urls);
    });

    test("/language with the strip open lands on a page with no strip and no iframe", async ({
      page,
    }) => {
      await stubSpotify(page);
      const urls = await trackSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(page.locator("iframe")).toHaveCount(1);

      await exec(page, lang.command);
      await expectClosedOnOtherPage(page, urls);
    });

    test("/music can be opened again on the new page", async ({ page }) => {
      await stubSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      await exec(page, lang.command);
      await expect(page).toHaveURL((url) => url.pathname === lang.otherPath);
      await exec(page, "/music");
      const other = languages.find((l) => l.path === lang.otherPath)!;
      await expect(page.getByRole("complementary", { name: other.landmark })).toBeVisible();
      await expect(page.locator("iframe")).toHaveCount(1);
      await expect(page.locator("iframe")).toHaveAttribute("title", other.iframeTitle);
    });
  });

  test(`JavaScript disabled on ${lang.path}: readable, no strip, no iframe`, async ({
    browser,
  }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(lang.path);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("section#contact")).toBeVisible();
    await expect(
      page.locator("#contact").getByRole("link", {
        name: lang.code === "en" ? "Spotify playlist" : "Playlist no Spotify",
        exact: true,
      }),
    ).toHaveAttribute("href", "https://open.spotify.com/playlist/4lrm0AHTGIV9BH77rG8qVt");
    await expect(page.getByRole("complementary")).toHaveCount(0);
    await expect(page.locator("iframe")).toHaveCount(0);
    await context.close();
  });
}

test.describe("what is identical in both languages", () => {
  test("the header, the close label, the statusline segment and the chip match", async ({
    page,
  }) => {
    await page.route(SPOTIFY, (route) =>
      route.fulfill({ contentType: "text/html", body: STUB_BODY }),
    );
    const seen: { header: string; close: string; segment: string; chip: string }[] = [];
    for (const lang of languages) {
      await page.goto(lang.path);
      const chip = (await page.getByRole("button", { name: /\[\/music\]/ }).textContent()) ?? "";
      await exec(page, "/music");
      const aside = page.getByRole("complementary", { name: lang.landmark });
      await expect(aside).toBeVisible();
      seen.push({
        header: ((await aside.locator("header span").textContent()) ?? "").trim(),
        close: ((await aside.getByRole("button").textContent()) ?? "").trim(),
        segment: ((await page.locator("footer").getByText("♪ music").textContent()) ?? "").trim(),
        chip: chip.match(/^\[\/music\]/)?.[0] ?? chip,
      });
    }
    expect(seen[0]).toEqual({
      header: "♪ Natan Profile",
      close: "[x]",
      segment: "♪ music",
      chip: "[/music]",
    });
    expect(seen[1]).toEqual(seen[0]);
  });
});

test.describe("dictionary parity for the music strings", () => {
  const en = getDictionary("en");
  const pt = getDictionary("pt");

  test("EN and PT define the same non-empty music keys", () => {
    expect(Object.keys(pt.music).sort()).toEqual(Object.keys(en.music).sort());
    for (const dict of [en, pt]) {
      for (const [key, value] of Object.entries(dict.music)) {
        expect(value.trim(), key).not.toBe("");
      }
      expect(dict.commands["/music"].description.trim()).not.toBe("");
      expect(dict.commands["/music"].chip.trim()).not.toBe("");
      expect(dict.sections.spotifyPlaylist.trim()).not.toBe("");
    }
  });

  test("the translatable strings differ and the identical tokens survive in both", () => {
    for (const key of [
      "alreadyOpen",
      "closed",
      "notOpen",
      "unknownArgument",
      "usage",
      "openLink",
      "closeName",
      "iframeTitle",
      "landmark",
      "embedError",
    ] as const) {
      expect(pt.music[key], key).not.toBe(en.music[key]);
    }
    for (const dict of [en, pt]) {
      expect(dict.music.opened).toContain("♪");
      expect(dict.music.opened).toContain('"{name}"');
      expect(dict.music.opened).toContain("{url}");
      expect(dict.music.alreadyOpen).toContain("/music off");
      expect(dict.music.usage).toContain("/music | /music off");
      expect(dict.music.iframeTitle).toContain("{name}");
    }
  });
});
