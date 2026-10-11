import { expect, test } from "@playwright/test";

// Every glyph must be a rectangle, or the rows of a word drift apart.
const WORDS = { NATAN: 45, MOREIRA: 55 } as const;

for (const url of ["/", "/pt"]) {
  test.describe(`ASCII banner on ${url}`, () => {
    test("shows NATAN above MOREIRA as stacked blocks of aligned rows", async ({
      page,
    }) => {
      await page.goto(url);
      const rows = (await page.locator("pre").innerText()).split("\n");
      // 6 rows, a blank row, 6 rows.
      expect(rows).toHaveLength(13);
      expect(rows[6]).toBe("");
      const [nataN, moreira] = [rows.slice(0, 6), rows.slice(7)];
      for (const row of nataN) expect(row.length).toBe(WORDS.NATAN);
      for (const row of moreira) expect(row.length).toBe(WORDS.MOREIRA);
      // The first row of each block is built from known glyph tops.
      expect(nataN[0]).toBe("███╗   ██╗ █████╗ ████████╗ █████╗ ███╗   ██╗");
      expect(moreira[0]).toBe("███╗   ███╗ ██████╗ ██████╗ ███████╗██╗██████╗  █████╗ ");
    });

    test("is decoration: one pre, hidden from assistive tech, name in the h1", async ({
      page,
    }) => {
      await page.goto(url);
      await expect(page.locator("pre")).toHaveCount(1);
      await expect(page.locator("pre")).toHaveAttribute("aria-hidden", "true");
      await expect(page.locator("h1")).toContainText("Natan Moreira");
    });

    for (const width of [375, 768, 1024, 1280]) {
      test(`fits its card without scrolling or touching the language toggle at ${width}px`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(url, { waitUntil: "networkidle" });
        const pre = page.locator("pre");
        const fits = await pre.evaluate((el) => {
          const card = el.parentElement!;
          return card.scrollWidth <= card.clientWidth;
        });
        expect(fits).toBe(true);
        const art = (await pre.boundingBox())!;
        const toggle = (await page.getByRole("navigation", { name: /^(Language|Idioma)$/ }).boundingBox())!;
        const overlaps =
          art.x < toggle.x + toggle.width &&
          art.x + art.width > toggle.x &&
          art.y < toggle.y + toggle.height &&
          art.y + art.height > toggle.y;
        expect(overlaps).toBe(false);
      });
    }
  });
}
