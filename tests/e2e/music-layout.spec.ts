import { expect, test, type Page } from "@playwright/test";

const STRIP_HEIGHT = 28 + 80;
const STATUSLINE_HEIGHT = 32;

const prompt = (page: Page) => page.locator("#command-prompt");
const strip = (page: Page) => page.getByRole("complementary");
const statusline = (page: Page) => page.locator("footer");
const segment = (page: Page) => statusline(page).getByText("♪ music");

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

const box = async (locator: ReturnType<Page["locator"]>) => {
  const b = await locator.boundingBox();
  if (!b) throw new Error("element has no box");
  return b;
};

/** Answers the Spotify embed with an empty page so tests stay offline. */
async function stubSpotify(page: Page) {
  await page.route(/^https:\/\/([^/]+\.)?(spotify\.com|scdn\.co)\//, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<!doctype html><title>stub</title><body style='background:#1f1f1f'>stub",
    }),
  );
}

async function open(page: Page, path: string, width: number) {
  await stubSpotify(page);
  await page.setViewportSize({ width, height: 800 });
  await page.goto(path, { waitUntil: "networkidle" });
  await exec(page, "/music");
  await expect(strip(page)).toBeVisible();
}

for (const path of ["/", "/pt"]) {
  test.describe(`music strip layout (${path})`, () => {
    test("390px: full width, docked on the statusline, primary top border", async ({
      page,
    }) => {
      await open(page, path, 390);
      const s = await box(strip(page));
      const f = await box(statusline(page));
      expect(s.x).toBe(0);
      expect(s.width).toBe(390);
      expect(s.y + s.height).toBe(f.y);
      expect(s.height).toBe(STRIP_HEIGHT);
      const style = await strip(page).evaluate((el) => {
        const c = getComputedStyle(el);
        return {
          topWidth: c.borderTopWidth,
          topColor: c.borderTopColor,
          primary: getComputedStyle(document.documentElement).getPropertyValue("--color-primary"),
        };
      });
      expect(style.topWidth).toBe("1px");
      const probe = await page.evaluate(() => {
        const el = document.createElement("i");
        el.style.color = "var(--color-primary)";
        document.body.append(el);
        const color = getComputedStyle(el).color;
        el.remove();
        return color;
      });
      expect(style.topColor).toBe(probe);
    });

    test("1280px: 480px card right-aligned to the margin with a flat offset shadow", async ({
      page,
    }) => {
      await open(page, path, 1280);
      const s = await box(strip(page));
      const f = await box(statusline(page));
      expect(s.width).toBe(480);
      expect(s.x + s.width).toBe(1280 - 24);
      expect(s.y + s.height).toBe(f.y);
      expect(s.height).toBe(STRIP_HEIGHT);
      const style = await strip(page).evaluate((el) => {
        const c = getComputedStyle(el);
        return { width: c.borderLeftWidth, top: c.borderTopWidth, shadow: c.boxShadow };
      });
      expect(style.width).toBe("1px");
      expect(style.top).toBe("1px");
      expect(style.shadow).toContain("rgb(0, 0, 0) 4px -4px 0px 0px");
    });

    test("768px: already the 480px card", async ({ page }) => {
      await open(page, path, 768);
      const s = await box(strip(page));
      expect(s.width).toBe(480);
      expect(s.height).toBe(STRIP_HEIGHT);
    });

    test("767px: still full width", async ({ page }) => {
      await open(page, path, 767);
      const s = await box(strip(page));
      expect(s.width).toBe(767);
      expect(s.height).toBe(STRIP_HEIGHT);
    });

    for (const width of [390, 1280]) {
      test(`${width}px: the last content line scrolls fully above the strip, padding goes away on close`, async ({
        page,
      }) => {
        const content = page.locator("main > div > div").last();
        const scrollEnd = async () => {
          await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
          await expect
            .poll(() =>
              page.evaluate(
                () =>
                  Math.ceil(window.scrollY + window.innerHeight) >=
                  document.documentElement.scrollHeight,
              ),
            )
            .toBe(true);
        };
        await open(page, path, width);
        const stripTop = (await box(strip(page))).y;
        await scrollEnd();
        // After the strip opens, the page must be reachable past it.
        const openBottom = (await box(content)).y + (await box(content)).height;
        expect(openBottom).toBeLessThanOrEqual((await box(strip(page))).y);
        expect(stripTop).toBeGreaterThan(0);

        const paddingOpen = await page.locator("main").evaluate(
          (el) => parseFloat(getComputedStyle(el).paddingBottom),
        );
        expect(paddingOpen).toBeGreaterThanOrEqual(STRIP_HEIGHT + STATUSLINE_HEIGHT);

        await exec(page, "/music off");
        await expect(strip(page)).toHaveCount(0);
        const paddingClosed = await page.locator("main").evaluate(
          (el) => parseFloat(getComputedStyle(el).paddingBottom),
        );
        expect(paddingClosed).toBeLessThan(paddingOpen);
        await scrollEnd();
        const closedBottom = (await box(content)).y + (await box(content)).height;
        expect(closedBottom).toBeLessThanOrEqual((await box(statusline(page))).y);
      });
    }

    for (const width of [320, 390, 768, 1280]) {
      test(`${width}px: the statusline shows ♪ music only while open, without overflow`, async ({
        page,
      }) => {
        await stubSpotify(page);
        await page.setViewportSize({ width, height: 800 });
        await page.goto(path, { waitUntil: "networkidle" });
        await expect(segment(page)).toHaveCount(0);

        await exec(page, "/music");
        await expect(segment(page)).toBeVisible();
        await expect(segment(page)).toHaveText("♪ music");

        // The segment and the position stay inside the bar, and the page does not scroll sideways.
        const bar = await box(statusline(page));
        for (const target of [segment(page), page.getByTestId("position"), page.getByTestId("mode")]) {
          const b = await box(target);
          expect(b.x).toBeGreaterThanOrEqual(bar.x);
          expect(b.x + b.width).toBeLessThanOrEqual(bar.x + bar.width);
        }
        const seg = await box(segment(page));
        const pos = await box(page.getByTestId("position"));
        expect(seg.x + seg.width).toBeLessThanOrEqual(pos.x);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        );
        expect(overflow).toBe(true);

        await exec(page, "/music off");
        await expect(segment(page)).toHaveCount(0);
      });
    }
  });
}
