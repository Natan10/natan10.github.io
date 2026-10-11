import { expect, test, type Page } from "@playwright/test";

const SPOTIFY = /^https:\/\/([^/]+\.)?(spotify\.com|scdn\.co)\//;
const STUB_BODY = "<!doctype html><title>stub</title><body style='background:#1f1f1f'>stub";

const languages = [
  {
    code: "en",
    path: "/",
    landmark: "Music player",
    closeName: "Close music player",
    openLink: "open in Spotify ↗",
    error: "Spotify could not be loaded. Use the link above to open the playlist.",
    unknown: (arg: string) => `unknown argument: ${arg}`,
    usage: "usage: /music | /music off",
  },
  {
    code: "pt",
    path: "/pt",
    landmark: "Player de música",
    closeName: "Fechar player de música",
    openLink: "abrir no Spotify ↗",
    error: "Não foi possível carregar o Spotify. Use o link acima para abrir a playlist.",
    unknown: (arg: string) => `argumento desconhecido: ${arg}`,
    usage: "uso: /music | /music off",
  },
] as const;

const prompt = (page: Page) => page.locator("#command-prompt");
const output = (page: Page) => page.getByRole("log");

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

const fulfillStub = (page: Page) =>
  page.route(SPOTIFY, (route) => route.fulfill({ contentType: "text/html", body: STUB_BODY }));

for (const lang of languages) {
  const strip = (page: Page) => page.getByRole("complementary", { name: lang.landmark });

  test.describe(`music player review fixes (${lang.code})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
    });

    test("an embed that answers after the timeout recovers from the error", async ({ page }) => {
      await page.route(SPOTIFY, async (route) => {
        await new Promise((r) => setTimeout(r, 10_000));
        await route.fulfill({ contentType: "text/html", body: STUB_BODY }).catch(() => {});
      });
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });

      // The late answer arrives: the error goes away and the embed is shown.
      await expect(strip(page).getByText(lang.error)).toHaveCount(0, { timeout: 15_000 });
      await expect(page.locator("iframe")).toBeVisible();
      await expect(page.frameLocator("iframe").locator("body")).toContainText("stub");
    });

    test("a healthy embed costs one GET of the embed document, not two", async ({ page }) => {
      const requests: string[] = [];
      await page.route(SPOTIFY, (route) => {
        requests.push(route.request().method());
        return route.fulfill({ contentType: "text/html", body: STUB_BODY });
      });
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(page.frameLocator("iframe").locator("body")).toContainText("stub");
      await page.waitForTimeout(500);
      expect(requests.filter((m) => m === "GET")).toHaveLength(1);
    });

    test("a blocked embed still shows the error and never flashes back to the embed", async ({
      page,
    }) => {
      await page.route(SPOTIFY, (route) => route.abort("failed"));
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(strip(page).getByText(lang.error)).toBeVisible({ timeout: 15_000 });
      await page.waitForTimeout(1500);
      await expect(strip(page).getByText(lang.error)).toBeVisible();
      await expect(page.locator("iframe")).toHaveCount(0);
    });

    test("the status region exists, empty, before the embed fails and is filled on failure", async ({
      page,
    }) => {
      // Never answers: the region stays empty until the timeout, then is filled.
      await page.route(SPOTIFY, () => new Promise<void>(() => {}));
      await page.goto(lang.path);
      await exec(page, "/music");
      const status = strip(page).locator('[role="status"]');
      await expect(status).toHaveCount(1);
      await expect(status).toHaveText("");
      // Present from the first render, so the later text is announced as a change.
      const handle = await status.elementHandle();
      await expect(status).toHaveText(lang.error, { timeout: 15_000 });
      expect(await handle?.evaluate((el) => el.isConnected)).toBe(true);
      expect(await status.evaluate((el, h) => el === h, handle)).toBe(true);
    });

    test("the iframe allows what Spotify's snippet needs, but never autoplay", async ({
      page,
    }) => {
      await fulfillStub(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      const allow = ((await page.locator("iframe").getAttribute("allow")) ?? "")
        .split(";")
        .map((s) => s.trim());
      expect(allow).toEqual(
        expect.arrayContaining([
          "encrypted-media",
          "clipboard-write",
          "fullscreen",
          "picture-in-picture",
        ]),
      );
      expect(allow).not.toContain("autoplay");
    });

    test("/music off extra names the extra token, not 'off'", async ({ page }) => {
      await fulfillStub(page);
      await page.goto(lang.path);
      await exec(page, "/music off extra");
      const lines = output(page).locator("p");
      await expect(lines.nth(1)).toHaveText(lang.unknown("extra"));
      await expect(lines.nth(2)).toHaveText(lang.usage);
      await expect(page.locator("iframe")).toHaveCount(0);
    });

    test("/music names the offending argument as typed, with its case", async ({ page }) => {
      await fulfillStub(page);
      await page.goto(lang.path);
      await exec(page, "/music FoO");
      await expect(output(page).locator("p").nth(1)).toHaveText(lang.unknown("FoO"));
    });

    test("/music foo off names the first offending token", async ({ page }) => {
      await fulfillStub(page);
      await page.goto(lang.path);
      await exec(page, "/music foo off");
      await expect(output(page).locator("p").nth(1)).toHaveText(lang.unknown("foo"));
    });

    test("closing with [x] from the keyboard moves focus to the prompt", async ({ page }) => {
      await fulfillStub(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      const close = strip(page).getByRole("button", { name: lang.closeName });
      await close.focus();
      await page.keyboard.press("Enter");
      await expect(strip(page)).toHaveCount(0);
      await expect(prompt(page)).toBeFocused();
    });

    test("closing with [x] by pointer does not steal focus", async ({ page }) => {
      await fulfillStub(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      await prompt(page).blur();
      await strip(page).getByRole("button", { name: lang.closeName }).click();
      await expect(strip(page)).toHaveCount(0);
      await expect(prompt(page)).not.toBeFocused();
    });

    test("the header title and the statusline label come from one source", async ({ page }) => {
      await fulfillStub(page);
      await page.goto(lang.path);
      await exec(page, "/music");
      await expect(strip(page).locator("header span")).toHaveText("♪ Natan Profile");
      await expect(page.locator("footer").getByText("♪ music")).toHaveText("♪ music");
      await expect(page.locator("iframe")).toHaveAttribute("title", /Natan Profile$/);
    });
  });
}
