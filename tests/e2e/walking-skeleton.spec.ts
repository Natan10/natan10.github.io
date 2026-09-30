import { expect, test } from "@playwright/test";

test.describe("walking skeleton", () => {
  test("shows the terminal shell, hero and boot card", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("guest@terminal:")).toBeVisible();
    await expect(page.getByText("[1: console.sh]")).toBeVisible();
    await expect(page.getByText("Macro Registers:")).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^\[\/(user|experience|skills|projects|theme|help|clear)\]/ }),
    ).toHaveCount(7);
    await expect(
      page.getByRole("region", { name: "Session boot log" }),
    ).toBeVisible();
    await expect(page.getByText("To get started")).toHaveCount(0);
  });

  test("has exactly one h1 with the owner's name and hides the ASCII art", async ({
    page,
  }) => {
    await page.goto("/");

    const headings = page.getByRole("heading", { level: 1 });
    await expect(headings).toHaveCount(1);
    await expect(headings).toContainText("Natan Moreira");

    const art = page.locator("pre");
    await expect(art).toHaveAttribute("aria-hidden", "true");
    await expect(art).toContainText("█");
    // Nothing from the banner leaks into the accessibility tree.
    // (Skill bars elsewhere on the page legitimately use the same glyph.)
    const bannerLine = (await art.innerText())
      .split("\n")
      .find((l) => l.includes("█"))!
      .trim();
    const snapshot = await page.locator("body").ariaSnapshot();
    expect(snapshot).not.toContain(bannerLine);
  });

  test("uses only JetBrains Mono and square corners", async ({ page }) => {
    await page.goto("/");

    const { families, rounded } = await page.evaluate(() => {
      const families = new Set<string>();
      const rounded: string[] = [];
      for (const el of document.body.querySelectorAll("*")) {
        const style = getComputedStyle(el);
        families.add(style.fontFamily.split(",")[0].trim().replace(/"/g, ""));
        if (style.borderRadius !== "0px") rounded.push(el.tagName);
      }
      return { families: [...families], rounded };
    });

    expect(rounded).toEqual([]);
    expect(families.every((f) => /jetbrains/i.test(f))).toBe(true);
  });

  test("renders the ASCII banner in JetBrains Mono, not a fallback font", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    // JetBrains Mono glyphs are 0.6em wide; a fallback font for the box-drawing
    // characters would make the widest row measurably wider or narrower.
    const { width, fontSize, columns } = await page.evaluate(() => {
      const pre = document.querySelector("pre")!;
      const columns = Math.max(...pre.textContent!.split("\n").map((l) => l.length));
      return {
        width: pre.getBoundingClientRect().width,
        fontSize: parseFloat(getComputedStyle(pre).fontSize),
        columns,
      };
    });
    expect(width).toBeCloseTo(columns * fontSize * 0.6, 0);
  });

  test("does not shift layout while loading", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __cls: number }).__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const shift = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!shift.hadRecentInput)
            (window as unknown as { __cls: number }).__cls += shift.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const cls = await page.evaluate(
      () => (window as unknown as { __cls: number }).__cls,
    );
    expect(cls).toBeLessThan(0.01);
  });

  for (const width of [1280, 375]) {
    test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/");

      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
    });
  }
});
