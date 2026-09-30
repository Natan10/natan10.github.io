import { expect, test } from "@playwright/test";

test.describe("content sections", () => {
  test.use({ javaScriptEnabled: false });

  const sections = [
    ["experience", "/experience"],
    ["skills", "/skills"],
    ["projects", "/projects"],
    ["takeaways", "/takeaways"],
    ["contact", "/contact"],
  ] as const;

  for (const [id, command] of sections) {
    test(`${id} is visible in its frame with JavaScript disabled`, async ({
      page,
    }) => {
      await page.goto(`/#${id}`);
      const section = page.locator(`section#${id}`);
      await expect(section).toBeVisible();
      await expect(section).toContainText(`[CMD: ${command}]`);
    });
  }

  test("sections appear in a stable order after identity", async ({ page }) => {
    await page.goto("/");
    const ids = await page
      .locator("section[id]")
      .evaluateAll((els) => els.map((el) => el.id));
    expect(ids).toEqual([
      "user",
      "experience",
      "skills",
      "projects",
      "takeaways",
      "contact",
    ]);
  });

  test("key content of each section is rendered", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator("#experience").getByRole("heading", { level: 3 }).first(),
    ).toBeVisible();
    await expect(
      page.locator("#experience").getByRole("list", { name: "Stack" }).first(),
    ).toBeVisible();
    await expect(
      page.locator("#projects").getByRole("link").first(),
    ).toBeVisible();
    await expect(
      page.locator("#takeaways").getByRole("heading", { level: 3 }).first(),
    ).toBeVisible();
  });

  test("skill bars match the percentage shown", async ({ page }) => {
    await page.goto("/");
    const bars = await page
      .getByTestId("skill-bar")
      .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
    expect(bars.length).toBeGreaterThan(0);
    for (const bar of bars) {
      const [, filled, pct] = bar.match(/\[(█*)░*\] (\d+)%/)!;
      expect(bar.match(/[█░]/g)!.length).toBe(20);
      expect(filled.length).toBe(Math.round((Number(pct) / 100) * 20));
    }
  });

  test("contact links and the CV link are clickable anchors", async ({
    page,
  }) => {
    await page.goto("/");
    const links = page.locator("#contact").getByRole("link");
    expect(await links.count()).toBeGreaterThan(1);
    const cv = page.locator("#contact").getByRole("link", { name: /Download CV/ });
    await expect(cv).toHaveAttribute("href", /\.pdf$/);
    await expect(cv).toHaveAttribute("download", /.+/);
  });

  test("headings never skip a level", async ({ page }) => {
    await page.goto("/");
    const levels = await page
      .locator("h1, h2, h3, h4")
      .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });
});
