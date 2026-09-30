import { expect, test } from "@playwright/test";

test.describe("metadata", () => {
  test("has the owner's title, description and social preview", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page).toHaveTitle("Natan Moreira — Software Engineer");
    const meta = (selector: string) =>
      page.locator(selector).getAttribute("content");

    expect(await meta('meta[name="description"]')).toContain("Natan Moreira");
    expect(await meta('meta[property="og:title"]')).toBe(
      "Natan Moreira — Software Engineer",
    );
    expect(await meta('meta[property="og:image"]')).toContain(
      "opengraph-image",
    );
    expect(await meta('meta[name="twitter:card"]')).toBe(
      "summary_large_image",
    );
  });

  test("serves the owner's favicon and social image", async ({
    page,
    request,
  }) => {
    await page.goto("/");

    const href = await page.locator('link[rel="icon"]').first().getAttribute("href");
    expect(href).toContain("icon");
    expect((await request.get(href!)).ok()).toBe(true);

    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    const ogPath = new URL(og!).pathname;
    const res = await request.get(ogPath);
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("image/png");
  });
});
