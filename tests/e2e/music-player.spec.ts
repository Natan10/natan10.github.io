import { expect, test, type Page } from "@playwright/test";

const PLAYLIST_ID = "4lrm0AHTGIV9BH77rG8qVt";
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;
const EMBED_BASE = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`;

const languages = [
  {
    code: "en",
    path: "/",
    landmark: "Music player",
    closeName: "Close music player",
    iframeTitle: "Spotify playlist: Natan Profile",
    openLink: "open in Spotify ↗",
    description: "open the Spotify playlist player",
    opened: `♪ opening playlist "Natan Profile": press play. Fallback: ${PLAYLIST_URL}`,
    already: "music player already open: /music off to close",
    closed: "music player closed",
    notOpen: "music player is not open",
    unknown: "unknown argument: foo",
    usage: "usage: /music | /music off",
  },
  {
    code: "pt",
    path: "/pt",
    landmark: "Player de música",
    closeName: "Fechar player de música",
    iframeTitle: "Playlist do Spotify: Natan Profile",
    openLink: "abrir no Spotify ↗",
    description: "abrir o player da playlist do Spotify",
    opened: `♪ abrindo a playlist "Natan Profile": aperte play. Alternativa: ${PLAYLIST_URL}`,
    already: "player de música já aberto: /music off para fechar",
    closed: "player de música fechado",
    notOpen: "o player de música não está aberto",
    unknown: "argumento desconhecido: foo",
    usage: "uso: /music | /music off",
  },
] as const;

// The prompt and the output log are named in the active language.
const prompt = (page: Page) => page.locator("#command-prompt");
const output = (page: Page) => page.getByRole("log");

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

/** Records every Spotify request and answers the embed with an empty page. */
async function stubSpotify(page: Page): Promise<string[]> {
  const urls: string[] = [];
  await page.route(/^https:\/\/([^/]+\.)?(spotify\.com|scdn\.co)\//, (route) => {
    urls.push(route.request().url());
    return route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>stub</title><body style='background:#1f1f1f'>stub embed",
    });
  });
  return urls;
}

for (const lang of languages) {
  test.describe(`music player (${lang.code})`, () => {
    let spotify: string[];

    test.beforeEach(async ({ page }) => {
      spotify = await stubSpotify(page);
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(lang.path);
    });

    const strip = (page: Page) => page.getByRole("complementary", { name: lang.landmark });

    test("nothing from Spotify exists before /music runs", async ({ page }) => {
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(strip(page)).toHaveCount(0);
      await page.waitForTimeout(300);
      expect(spotify).toEqual([]);
    });

    test("/music opens the strip with one embed and prints the plain URL", async ({
      page,
    }) => {
      await prompt(page).focus();
      await exec(page, "/music");

      await expect(strip(page)).toBeVisible();
      await expect(page.locator("iframe")).toHaveCount(1);
      const iframe = page.locator("iframe");
      await expect(iframe).toHaveAttribute("title", lang.iframeTitle);
      const src = new URL((await iframe.getAttribute("src")) ?? "");
      expect(`${src.origin}${src.pathname}`).toBe(EMBED_BASE);
      expect(src.searchParams.get("theme")).toBe("0");
      expect(await iframe.getAttribute("allow")).not.toMatch(/autoplay/);
      expect(await iframe.getAttribute("src")).not.toMatch(/autoplay/);

      const lines = output(page).locator("p");
      await expect(lines.filter({ hasText: PLAYLIST_URL })).toHaveCount(1);
      await expect(output(page)).toContainText(lang.opened);
      await expect.poll(() => spotify.some((u) => u.startsWith(EMBED_BASE))).toBe(true);
    });

    test(":music is an alias", async ({ page }) => {
      await exec(page, ":music");
      await expect(strip(page)).toBeVisible();
      await expect(page.locator("iframe")).toHaveCount(1);
    });

    test("the header shows the title, a link to the playlist and [x]", async ({ page }) => {
      await exec(page, "/music");
      await expect(strip(page)).toContainText("♪ Natan Profile");
      const link = strip(page).getByRole("link", { name: lang.openLink });
      await expect(link).toHaveAttribute("href", PLAYLIST_URL);
      await expect(link).toHaveAttribute("target", "_blank");
      const close = strip(page).getByRole("button", { name: lang.closeName });
      await expect(close).toHaveText("[x]");
    });

    test("opening leaves focus in the prompt and j/k/gg/G still scroll", async ({
      page,
    }) => {
      await exec(page, "/music");
      await expect(prompt(page)).toBeFocused();
      expect(await page.evaluate(() => document.activeElement?.id)).toBe("command-prompt");

      await prompt(page).press("Escape");
      await page.keyboard.press("j");
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      await page.keyboard.press("G");
      const bottom = await page.evaluate(() => window.scrollY);
      expect(bottom).toBeGreaterThan(100);
      await page.keyboard.press("g");
      await page.keyboard.press("g");
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    });

    test("/music while open says so and creates no second embed", async ({ page }) => {
      await exec(page, "/music");
      await exec(page, "/music");
      await expect(output(page)).toContainText(lang.already);
      await expect(page.locator("iframe")).toHaveCount(1);
    });

    test("/music off removes the embed and hides the strip", async ({ page }) => {
      await exec(page, "/music");
      await exec(page, "/music off");
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(strip(page)).toHaveCount(0);
      await expect(output(page)).toContainText(lang.closed);
    });

    test("[x] is a focusable button that closes the player", async ({ page }) => {
      await exec(page, "/music");
      const close = strip(page).getByRole("button", { name: lang.closeName });
      await close.focus();
      await expect(close).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(strip(page)).toHaveCount(0);
      await expect(output(page)).toContainText(lang.closed);
    });

    test("/music off while closed says it is not open", async ({ page }) => {
      await exec(page, "/music off");
      await expect(output(page)).toContainText(lang.notOpen);
      await expect(page.locator("iframe")).toHaveCount(0);
    });

    test("/music can be reopened after closing", async ({ page }) => {
      await exec(page, "/music");
      await exec(page, "/music off");
      await exec(page, "/music");
      await expect(page.locator("iframe")).toHaveCount(1);
      await expect(strip(page)).toBeVisible();
    });

    test("/music foo echoes, names the argument and prints the usage", async ({ page }) => {
      await exec(page, "/music foo");
      const lines = output(page).locator("p");
      await expect(lines.nth(0)).toContainText("/music foo");
      await expect(lines.nth(1)).toHaveText(lang.unknown);
      await expect(lines.nth(2)).toHaveText(lang.usage);
      await expect(page.locator("iframe")).toHaveCount(0);
    });

    test("/help lists /music with its description", async ({ page }) => {
      await exec(page, "/help");
      await expect(output(page)).toContainText("/music, :music");
      await expect(output(page)).toContainText(lang.description);
    });

    test("Tab completes /mu to /music", async ({ page }) => {
      await prompt(page).fill("/mu");
      await prompt(page).press("Tab");
      await expect(prompt(page)).toHaveValue("/music ");
      await prompt(page).fill(":mu");
      await prompt(page).press("Tab");
      await expect(prompt(page)).toHaveValue(":music ");
    });

    test("the hero has a /music chip that opens the player", async ({ page }) => {
      const chip = page.getByRole("button", { name: /\[\/music\]/ });
      await expect(chip).toBeVisible();
      await chip.click();
      await expect(strip(page)).toBeVisible();
      await expect(page.locator("iframe")).toHaveCount(1);
    });
  });
}

test("the command name and chip are identical in both languages", async ({ page }) => {
  const chips: string[] = [];
  for (const { path } of languages) {
    await page.goto(path);
    chips.push(
      (await page.getByRole("button", { name: /\[\/music\]/ }).textContent()) ?? "",
    );
  }
  expect(chips[0]).toMatch(/^\[\/music\]/);
  expect(chips[1]).toMatch(/^\[\/music\]/);
});
