import { expect, test } from "@playwright/test";

test.describe("identity section", () => {
  test.use({ javaScriptEnabled: false });

  test("is visible inside the section frame with JavaScript disabled", async ({
    page,
  }) => {
    await page.goto("/");

    const identity = page.locator("section#user");
    await expect(identity).toBeVisible();
    await expect(identity).toContainText("[CMD: /user]");
    await expect(
      identity.getByRole("heading", { level: 2, name: "Natan Moreira" }),
    ).toBeVisible();
    await expect(identity).toContainText("Software Engineer");
    await expect(identity.getByText("location", { exact: true })).toBeVisible();
    await expect(identity.getByText("status", { exact: true })).toBeVisible();
    await expect(identity.getByRole("list", { name: "Tags" })).toBeVisible();
  });

  test("shows a marked placeholder until the owner photo is supplied", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("avatar")).toContainText("TODO: owner photo");
  });

  test("frame counters are derived from the content", async ({ page }) => {
    await page.goto("/");
    const identity = page.locator("section#user");
    const footer = await identity.getByText(/^└── \d+L, \d+B ──┘$/).innerText();
    const [, lines, bytes] = footer.match(/(\d+)L, (\d+)B/)!;

    // name, title, tags, location, status + one bio paragraph
    expect(Number(lines)).toBe(6);
    const text = [
      "name: Natan Moreira",
      "title: Software Engineer",
      /* remaining lines are longer copy; assert on a lower bound */
    ].join("\n");
    expect(Number(bytes)).toBeGreaterThan(text.length);
    await expect(identity).toContainText("[OK]");
  });
});
