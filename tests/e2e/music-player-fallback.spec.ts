import { expect, test, type Page } from "@playwright/test";

const languages = [
  {
    code: "en",
    path: "/",
    landmark: "Music player",
    closeName: "Close music player",
    openLink: "open in Spotify ↗",
    closed: "music player closed",
    error: "Spotify could not be loaded. Use the link above to open the playlist.",
  },
  {
    code: "pt",
    path: "/pt",
    landmark: "Player de música",
    closeName: "Fechar player de música",
    openLink: "abrir no Spotify ↗",
    closed: "player de música fechado",
    error: "Não foi possível carregar o Spotify. Use o link acima para abrir a playlist.",
  },
] as const;

const SPOTIFY = /^https:\/\/([^/]+\.)?(spotify\.com|scdn\.co)\//;
const STUB_BODY = "<!doctype html><title>stub</title><body style='background:#1f1f1f'>stub";

const prompt = (page: Page) => page.locator("#command-prompt");
const output = (page: Page) => page.getByRole("log");

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

const blockSpotify = (page: Page) => page.route(SPOTIFY, (route) => route.abort("failed"));

for (const lang of languages) {
  test.describe(`blocked embed fallback (${lang.code})`, () => {
    const strip = (page: Page) => page.getByRole("complementary", { name: lang.landmark });

    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    test("a blocked embed keeps the header and shows the error in its place", async ({
      page,
    }) => {
      await blockSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");

      await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(strip(page).getByRole("link", { name: lang.openLink })).toBeVisible();
      await expect(strip(page).getByRole("button", { name: lang.closeName })).toBeVisible();
    });

    test("after a failure [x] closes the strip and /music can run again", async ({ page }) => {
      await blockSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });

      await strip(page).getByRole("button", { name: lang.closeName }).click();
      await expect(strip(page)).toHaveCount(0);
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(output(page)).toContainText(lang.closed);

      await exec(page, "/music");
      await expect(strip(page)).toBeVisible();
      await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });
    });

    test("after a failure /music off closes the strip", async ({ page }) => {
      await blockSpotify(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });

      await exec(page, "/music off");
      await expect(strip(page)).toHaveCount(0);
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(output(page)).toContainText(lang.closed);
    });

    test("an embed that never answers falls back to the error after the timeout", async ({
      page,
    }) => {
      // Never fulfilled: no load event and no error event ever fire.
      await page.route(SPOTIFY, () => new Promise<void>(() => {}));
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(page.locator("iframe")).toHaveCount(1);
      await expect(strip(page).getByText(lang.error)).toHaveCount(0);
      await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });
      await expect(strip(page).getByRole("link", { name: lang.openLink })).toBeVisible();
    });

    test("a successful load shows no error", async ({ page }) => {
      await page.route(SPOTIFY, (route) =>
        route.fulfill({ contentType: "text/html", body: STUB_BODY }),
      );
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(page.locator("iframe")).toHaveCount(1);
      await page.waitForTimeout(1000);
      await expect(strip(page).getByText(lang.error)).toHaveCount(0);
      await expect(page.locator("iframe")).toHaveCount(1);
    });

    test("a slow but successful load never shows the error", async ({ page }) => {
      await page.route(SPOTIFY, async (route) => {
        await new Promise((r) => setTimeout(r, 2500));
        await route.fulfill({ contentType: "text/html", body: STUB_BODY });
      });
      await page.goto(lang.path);
      await exec(page, "/music");

      // Past the load, and long after, the iframe stays and no error appears.
      await page.waitForTimeout(3500);
      await expect(page.locator("iframe")).toHaveCount(1);
      await expect(strip(page).getByText(lang.error)).toHaveCount(0);
      await page.waitForTimeout(10_000);
      await expect(page.locator("iframe")).toHaveCount(1);
      await expect(strip(page).getByText(lang.error)).toHaveCount(0);
    });
  });
}
