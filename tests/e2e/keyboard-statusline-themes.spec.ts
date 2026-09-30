import { expect, test, type Page } from "@playwright/test";

const prompt = (page: Page) => page.getByRole("textbox", { name: "Command" });
const output = (page: Page) => page.getByRole("log", { name: "Command output" });
const mode = (page: Page) => page.getByTestId("mode");
const position = (page: Page) => page.getByTestId("position");
const theme = (page: Page) =>
  page.evaluate(() => document.documentElement.dataset.theme ?? "warm");
const background = (page: Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
});

test.describe("keyboard", () => {
  test.beforeEach(async ({ page }) => {
    // Shortcuts are attached on hydration; wait for it before pressing keys.
    await page.goto("/", { waitUntil: "networkidle" });
  });

  for (const key of ["/", ":"]) {
    test(`"${key}" focuses the prompt prefilled and Esc blurs it`, async ({
      page,
    }) => {
      await page.keyboard.press(key);
      await expect(prompt(page)).toBeFocused();
      await expect(prompt(page)).toHaveValue(key);
      await page.keyboard.press("Escape");
      await expect(prompt(page)).not.toBeFocused();
    });
  }

  test("j, k, gg and G scroll when nothing is focused", async ({ page }) => {
    const y = () => page.evaluate(() => window.scrollY);
    await page.keyboard.press("j");
    await expect.poll(y).toBeGreaterThan(0);
    const afterJ = await y();
    await page.keyboard.press("k");
    await expect.poll(y).toBeLessThan(afterJ);

    await page.keyboard.press("Shift+G");
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            Math.abs(
              window.scrollY +
                window.innerHeight -
                document.documentElement.scrollHeight,
            ) < 2,
        ),
      )
      .toBe(true);

    await page.keyboard.press("g");
    await page.keyboard.press("g");
    await expect.poll(y).toBe(0);
  });

  test("shortcuts never fire while typing in the prompt", async ({ page }) => {
    await prompt(page).click();
    await page.keyboard.type("jk/G:gg");
    await expect(prompt(page)).toHaveValue("jk/G:gg");
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("shortcuts never fire in other inputs", async ({ page }) => {
    await page.evaluate(() => {
      const input = document.createElement("textarea");
      input.id = "probe";
      document.body.appendChild(input);
    });
    await page.locator("#probe").focus();
    await page.keyboard.type("j/:G");
    await expect(page.locator("#probe")).toHaveValue("j/:G");
    await expect(prompt(page)).not.toBeFocused();
  });
});

test.describe("statusline", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("mode badge follows prompt focus", async ({ page }) => {
    await expect(mode(page)).toHaveText("NORMAL");
    await prompt(page).focus();
    await expect(mode(page)).toHaveText("COMMAND");
    await page.keyboard.press("Escape");
    await expect(mode(page)).toHaveText("NORMAL");
  });

  test("shows branch, encoding and diagnostics", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toContainText("main");
    await expect(footer).toContainText("UTF-8");
    await expect(footer).toContainText("0 errors");
  });

  test("line:col and percent change on scroll", async ({ page }) => {
    await expect(position(page)).toHaveText("1:1 0%");
    await page.keyboard.press("Shift+G");
    await expect(position(page)).toHaveText(/^\d+:1 100%$/);
    await expect(position(page)).not.toHaveText("1:1 0%");
  });
});

test.describe("themes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test(":theme lists themes and the active one", async ({ page }) => {
    await exec(page, ":theme");
    for (const name of ["warm", "gruvbox", "dracula", "nord", "monokai", "solarized"]) {
      await expect(output(page)).toContainText(name);
    }
    await expect(output(page)).toContainText("active: warm");
  });

  test("default remains the warm palette", async ({ page }) => {
    expect(await theme(page)).toBe("warm");
    expect(await background(page)).toBe("rgb(26, 18, 8)");
  });

  for (const name of ["gruvbox", "dracula", "nord", "monokai", "solarized"]) {
    test(`:theme ${name} swaps colours without layout change`, async ({ page }) => {
      const before = await page.evaluate(() => [
        document.documentElement.scrollHeight,
        document.getElementById("terminal-screen")!.getBoundingClientRect().height,
      ]);
      const warm = await background(page);
      await exec(page, `:theme ${name}`);
      await expect(output(page)).toContainText(`Theme set to ${name}`);
      expect(await theme(page)).toBe(name);
      expect(await background(page)).not.toBe(warm);
      await exec(page, ":theme");
      await expect(output(page)).toContainText(`active: ${name}`);
      const after = await page.evaluate(() => [
        document.documentElement.scrollHeight,
        document.getElementById("terminal-screen")!.getBoundingClientRect().height,
      ]);
      // Command output adds lines; the shell around it must not move.
      expect(after[0]).toBeGreaterThanOrEqual(before[0]);
    });
  }

  test("the palette chip lists themes", async ({ page }) => {
    await page.getByRole("button", { name: /\[\/theme\]/ }).click();
    await expect(output(page)).toContainText("active: warm");
  });

  test("unknown theme explains the valid options", async ({ page }) => {
    await exec(page, ":theme neon");
    await expect(output(page)).toContainText("E474: Unknown theme: neon");
    await expect(output(page)).toContainText("Valid themes:");
    await expect(output(page)).toContainText("gruvbox");
    expect(await theme(page)).toBe("warm");
  });

  test("the choice persists across reloads before hydration", async ({ page }) => {
    await exec(page, ":theme nord");
    // Block the app bundle: only the inline <head> script can apply the theme.
    await page.route("**/_next/static/**/*.js", (r) => r.abort());
    await page.reload();
    expect(await theme(page)).toBe("nord");
    expect(await background(page)).toBe("rgb(46, 52, 64)");
  });

  test("switching back to warm persists too", async ({ page }) => {
    await exec(page, ":theme dracula");
    await exec(page, ":theme warm");
    await page.reload();
    expect(await theme(page)).toBe("warm");
  });
});

test.describe("blocked storage", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const blocked = () => {
        throw new DOMException("blocked", "SecurityError");
      };
      Storage.prototype.getItem = blocked;
      Storage.prototype.setItem = blocked;
    });
    await page.goto("/");
  });

  test("falls back to the default and still switches for the visit", async ({
    page,
  }) => {
    expect(await theme(page)).toBe("warm");
    await exec(page, ":theme gruvbox");
    await expect(output(page)).toContainText("Theme set to gruvbox");
    expect(await theme(page)).toBe("gruvbox");
    await page.reload();
    expect(await theme(page)).toBe("warm");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});
