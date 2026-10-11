import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const themes = ["warm", "gruvbox", "dracula", "nord", "monokai", "solarized"];
const widths = [1280, 1024, 768, 375] as const;

const seedTheme = (page: Page, theme: string) =>
  page.addInitScript((t) => localStorage.setItem("theme", t), theme);

test.describe("/pt fit and finish", () => {
  for (const theme of themes) {
    test(`[C33] no axe violations on /pt in the ${theme} theme`, async ({ page }) => {
      await seedTheme(page, theme);
      await page.goto("/pt", { waitUntil: "networkidle" });
      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(
        violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`),
      ).toEqual([]);
    });

    for (const width of widths) {
      test(`[C34] no horizontal overflow on /pt in ${theme} at ${width}px`, async ({
        page,
      }) => {
        await seedTheme(page, theme);
        await page.setViewportSize({ width, height: 800 });
        await page.goto("/pt", { waitUntil: "networkidle" });
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });
    }
  }

  test("[C35] the keyboard pass over /pt reaches 17 or more elements, each with a 2px outline", async ({
    page,
  }) => {
    await page.goto("/pt", { waitUntil: "networkidle" });
    const seen = new Set<string>();
    for (let i = 0; i < 80; i++) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement;
        if (!el || el === document.body) return null;
        const s = getComputedStyle(el);
        const all = Array.from(document.querySelectorAll("a,button,input"));
        return {
          id: `${el.tagName}:${all.indexOf(el)}:${el.textContent?.trim().slice(0, 30) || el.id}`,
          width: parseFloat(s.outlineWidth),
          style: s.outlineStyle,
        };
      });
      if (!info || seen.has(info.id)) break;
      seen.add(info.id);
      expect(info.style, info.id).not.toBe("none");
      expect(info.width, info.id).toBeGreaterThanOrEqual(2);
    }
    expect(seen.size).toBeGreaterThanOrEqual(17);
  });
});
