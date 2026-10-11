import { expect, test, type Page } from "@playwright/test";

const prompt = (page: Page) => page.getByRole("textbox", { name: "Command" });
const output = (page: Page) => page.getByRole("log", { name: "Command output" });

async function exec(page: Page, command: string) {
  await prompt(page).fill(command);
  await prompt(page).press("Enter");
}

test.describe("command prompt", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
  });

  const sections = [
    "user",
    "experience",
    "skills",
    "projects",
    "contact",
    "takeaways",
  ];

  for (const id of sections) {
    test(`/${id} typed scrolls to, highlights and confirms the section`, async ({
      page,
    }) => {
      await exec(page, `/${id}`);
      await expect(page.locator(`section#${id}`)).toHaveAttribute(
        "data-highlight",
        "true",
      );
      await expect(page.locator(`section#${id}`)).toBeInViewport();
      await expect(output(page)).toContainText("Opened");
      await expect(prompt(page)).toHaveValue("");
      await expect(prompt(page)).toBeFocused();
    });
  }

  test("matching is case-insensitive and trimmed", async ({ page }) => {
    await exec(page, "   /SKILLS  ");
    await expect(page.locator("section#skills")).toHaveAttribute(
      "data-highlight",
      "true",
    );
  });

  test("EXEC button runs the typed command", async ({ page }) => {
    await prompt(page).fill("/projects");
    await page.getByRole("button", { name: "EXEC" }).click();
    await expect(output(page)).toContainText("Opened projects");
  });

  test("macro chips run their command", async ({ page }) => {
    await page.getByRole("button", { name: /\[\/experience\]/ }).click();
    await expect(page.locator("section#experience")).toBeInViewport();
    await expect(output(page)).toContainText("Opened experience");
  });

  test("/help lists every command and chips reflect the same set", async ({
    page,
  }) => {
    await exec(page, "/help");
    for (const name of [
      "/user",
      "/experience",
      "/skills",
      "/projects",
      "/contact",
      "/takeaways",
      ":theme",
      "/help",
      "/clear",
      ":w",
      ":q",
    ]) {
      await expect(output(page)).toContainText(name);
    }
    // every chip's command is listed in /help
    const chips = await page
      .getByRole("button", { name: /^\[\// })
      .evaluateAll((els) =>
        els.map((el) => el.textContent!.match(/\[(\/\w+)\]/)![1]),
      );
    const help = await output(page).innerText();
    for (const chip of chips) expect(help).toContain(chip);
  });

  test("/clear and :c reset the output", async ({ page }) => {
    await exec(page, "/help");
    await expect(output(page)).not.toBeEmpty();
    await exec(page, "/clear");
    await expect(output(page)).toBeEmpty();
    await expect(
      page.getByRole("region", { name: "Session boot log" }),
    ).toBeVisible();

    await exec(page, "/user");
    await exec(page, ":c");
    await expect(output(page)).toBeEmpty();

    await exec(page, "/user");
    await page.getByRole("button", { name: "CLEAR", exact: true }).click();
    await expect(output(page)).toBeEmpty();
  });

  test("unknown input shows E492 and a /help hint", async ({ page }) => {
    await exec(page, "foo");
    await expect(output(page)).toContainText("E492: Not an editor command: foo");
    await expect(output(page)).toContainText("/help");
  });

  test("Up/Down recall previous commands", async ({ page }) => {
    await exec(page, "/user");
    await exec(page, "/skills");
    await prompt(page).press("ArrowUp");
    await expect(prompt(page)).toHaveValue("/skills");
    await prompt(page).press("ArrowUp");
    await expect(prompt(page)).toHaveValue("/user");
    await prompt(page).press("ArrowDown");
    await expect(prompt(page)).toHaveValue("/skills");
    await prompt(page).press("ArrowDown");
    await expect(prompt(page)).toHaveValue("");
  });

  test("Tab completes a unique prefix", async ({ page }) => {
    await prompt(page).fill("/exp");
    await prompt(page).press("Tab");
    await expect(prompt(page)).toHaveValue("/experience ");
  });

  test("Tab lists type-annotated suggestions for an ambiguous prefix", async ({
    page,
  }) => {
    await prompt(page).fill("/");
    await prompt(page).press("Tab");
    await expect(output(page)).toContainText("/user (section)");
    await expect(output(page)).toContainText("/help (system)");
  });

  test(":w downloads the CV", async ({ page }) => {
    const download = page.waitForEvent("download");
    await exec(page, ":w");
    expect((await download).suggestedFilename()).toMatch(/\.pdf$/);
    await expect(output(page)).toContainText("written");
  });

  test(":q answers in character and the page keeps working", async ({ page }) => {
    await exec(page, ":q");
    await expect(output(page)).toContainText("E37");
    await exec(page, "/user");
    await expect(output(page)).toContainText("Opened identity");
  });

  test("results are announced through a polite live region", async ({ page }) => {
    await expect(output(page)).toHaveAttribute("aria-live", "polite");
  });
});
