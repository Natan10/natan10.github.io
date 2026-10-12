import { expect, test } from "@playwright/test";

const origin = "https://natan10.github.io";

test("the exported language routes expose public metadata and assets", async ({ page, request }) => {
  for (const route of ["/", "/pt"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(new URL(canonical!).origin).toBe(origin);
    expect(new URL(canonical!).pathname).toBe(route);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", new RegExp(`^${origin}/?$`));
    await expect(page.locator('link[rel="alternate"][hreflang="pt-BR"]')).toHaveAttribute("href", `${origin}/pt`);

    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toMatch(new RegExp(`^${origin}/`));
    expect((await request.get(new URL(image!).pathname)).ok()).toBe(true);

    const favicon = await page.locator('link[rel="icon"]').getAttribute("href");
    expect((await request.get(favicon!)).ok()).toBe(true);
  }

  for (const path of ["/avatar.jpg", "/cv.pdf"]) {
    expect((await request.get(path)).ok(), path).toBe(true);
  }

  for (const [selector, attr] of [['link[rel="stylesheet"]', "href"], ['script[src*="/_next/"]', "src"], ['link[as="font"]', "href"]]) {
    const asset = await page.locator(selector).first().getAttribute(attr);
    expect(asset).toBeTruthy();
    expect((await request.get(asset!)).ok(), asset!).toBe(true);
  }
});
