import { expect, test, type Page } from "@playwright/test";

const widths = [1280, 1024, 768, 375] as const;
const themes = ["warm", "gruvbox", "dracula", "nord", "monokai", "solarized"];

const overflow = (page: Page) =>
  page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

test.describe("no horizontal overflow", () => {
  for (const theme of themes) {
    for (const width of widths) {
      test(`${theme} at ${width}px`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
        await page.setViewportSize({ width, height: 800 });
        await page.goto("/", { waitUntil: "networkidle" });
        const { scrollWidth, clientWidth } = await overflow(page);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });
    }
  }

  test("still fits after running commands that add output", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    const prompt = page.getByRole("textbox", { name: "Command" });
    for (const cmd of ["/help", "/", "notacommand-with-a-really-long-name-here"]) {
      await prompt.fill(cmd);
      await prompt.press(cmd === "/" ? "Tab" : "Enter");
    }
    const { scrollWidth, clientWidth } = await overflow(page);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});

test.describe("mobile (375px)", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("statusline shows only mode, short filename and position", async ({
    page,
  }) => {
    const footer = page.locator("footer");
    await expect(page.getByTestId("mode")).toBeVisible();
    await expect(footer.getByText("profile.vim")).toBeVisible();
    await expect(page.getByTestId("position")).toBeVisible();
    await expect(footer.getByText("UTF-8")).toBeHidden();
    await expect(footer.getByText("⎇ main")).toBeHidden();
    await expect(footer.getByText(/0 errors/)).toBeHidden();
  });

  test("top-bar tabs stay visible and usable", async ({ page }) => {
    const tab = page.getByRole("button", { name: "[3: skills.json]" });
    await expect(tab).toBeVisible();
    await tab.click();
    const section = page.locator("section#skills");
    await expect(section).toBeInViewport();
    // The fixed header must not cover the top of the section it scrolled to.
    const headerBottom = await page
      .locator("header")
      .first()
      .evaluate((el) => el.getBoundingClientRect().bottom);
    await expect
      .poll(() => section.evaluate((el) => el.getBoundingClientRect().top))
      .toBeGreaterThanOrEqual(headerBottom - 1);
  });

  test("chips, tabs and prompt controls have comfortable tap targets", async ({
    page,
  }) => {
    const targets = [
      ...(await page.getByRole("button", { name: /^\[\// }).all()),
      ...(await page.getByRole("button", { name: /^\[\d:/ }).all()),
      page.getByRole("button", { name: "EXEC" }),
      page.getByRole("button", { name: "CLEAR", exact: true }),
      page.getByRole("textbox", { name: "Command" }),
    ];
    expect(targets.length).toBeGreaterThan(10);
    for (const target of targets) {
      const box = await target.boundingBox();
      expect(box!.height, await target.innerText().catch(() => "")).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe("tablet (768px)", () => {
  test("uses the desktop statusline and inline tabs without breakage", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("footer").getByText("UTF-8")).toBeVisible();
    await expect(page.getByRole("button", { name: "[1: console.sh]" })).toBeVisible();
    const header = await page.locator("header").first().boundingBox();
    expect(header!.height).toBeLessThanOrEqual(65);
  });
});

test.describe("desktop (1024px and up)", () => {
  for (const width of [1024, 1280]) {
    test(`full arrangement at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator("footer").getByText("⎇ main")).toBeVisible();
      const header = await page.locator("header").first().boundingBox();
      expect(header!.height).toBeLessThanOrEqual(65);
    });
  }
});
