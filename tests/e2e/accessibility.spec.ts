import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const themes = ["warm", "gruvbox", "dracula", "nord", "monokai", "solarized"];

test.describe("axe scan and contrast", () => {
  for (const theme of themes) {
    test(`no axe violations in the ${theme} theme`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto("/", { waitUntil: "networkidle" });
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`),
      ).toEqual([]);
    });

    test(`no axe violations in the ${theme} theme at 375px with command output`, async ({
      page,
    }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.setViewportSize({ width: 375, height: 800 });
      await page.goto("/", { waitUntil: "networkidle" });
      const prompt = page.getByRole("textbox", { name: "Command" });
      for (const cmd of ["/help", "nope", "/"]) {
        await prompt.fill(cmd);
        await prompt.press(cmd === "/" ? "Tab" : "Enter");
      }
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`),
      ).toEqual([]);
    });
  }
});

test.describe("focus", () => {
  test("every interactive element shows a visible focus indicator via keyboard", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const seen = new Set<string>();
    for (let i = 0; i < 80; i++) {
      // Tab order is a single pass; stop once focus leaves the page.
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        return {
          id: `${el.tagName}:${Array.from(document.querySelectorAll("a,button,input")).indexOf(el)}:${el.textContent?.trim().slice(0, 30) || el.id}:${el.getAttribute("href") ?? ""}`,
          width: parseFloat(s.outlineWidth),
          style: s.outlineStyle,
          color: s.outlineColor,
        };
      });
      if (!info) break;
      if (seen.has(info.id)) break;
      seen.add(info.id);
      expect(info.style, info.id).not.toBe("none");
      expect(info.width, info.id).toBeGreaterThanOrEqual(2);
      expect(info.color, info.id).not.toBe("rgba(0, 0, 0, 0)");
    }
    // chips + prompt controls + section links must all have been reached
    expect(seen.size).toBeGreaterThanOrEqual(17);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no running animations and scrolling is not smooth", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const running = await page.evaluate(() =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running")
        .map((a) => a.id || (a.effect as KeyframeEffect)?.target?.className),
    );
    expect(running).toEqual([]);
    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behavior).not.toBe("smooth");
  });

  test("navigation commands jump instead of animating", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const prompt = page.getByRole("textbox", { name: "Command" });
    await prompt.fill("/contact");
    await prompt.press("Enter");
    // Instant scroll: the section is in view on the next frame, no easing.
    await expect(page.locator("section#contact")).toBeInViewport({ timeout: 300 });
  });
});

test.describe("motion allowed", () => {
  test("decorative animations exist by default", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const count = await page.evaluate(() => document.getAnimations().length);
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("assistive tech chrome", () => {
  test("box-drawing decoration is hidden from the accessibility tree", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const snapshot = await page.locator("body").ariaSnapshot();
    expect(snapshot).not.toMatch(/[┌└─┐┘]{2,}/);
  });
});
