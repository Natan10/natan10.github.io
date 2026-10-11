import { expect, test, type Page } from "@playwright/test";

const THEMES = ["warm", "gruvbox", "dracula", "nord", "monokai", "solarized"] as const;

// A stand-in for Spotify's compact embed: a transparent document that paints a
// rounded dark card, so the corners show whatever sits behind the iframe.
const STUB_EMBED = `<!doctype html><title>stub</title>
<body style="margin:0;background:transparent">
<div style="height:100vh;box-sizing:border-box;border-radius:12px;background:#282828;color:#b3b3b3;font:14px sans-serif;padding:8px">stub embed</div>`;

async function openPlayer(page: Page) {
  await page.route(/^https:\/\/([^/]+\.)?(spotify\.com|scdn\.co)\//, (route) =>
    route.fulfill({ contentType: "text/html", body: STUB_EMBED }),
  );
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/");
  await page.locator("#command-prompt").fill("/music");
  await page.locator("#command-prompt").press("Enter");
  const strip = page.getByRole("complementary", { name: "Music player" });
  await expect(strip).toBeVisible();
  const frame = page.frameLocator("iframe");
  await expect(frame.locator("body")).toContainText("stub embed");
  return strip;
}

/** Counts near-white pixels in a PNG, decoded in the page with a canvas. */
async function countWhitePixels(page: Page, png: Buffer): Promise<number> {
  return page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const { data } = ctx.getImageData(0, 0, img.width, img.height);
    let white = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] >= 240 && data[i + 1] >= 240 && data[i + 2] >= 240) white++;
    }
    return white;
  }, png.toString("base64"));
}

test("the strip wrapper is square with a 1px border", async ({ page }) => {
  const strip = await openPlayer(page);
  const style = await strip.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      radii: [
        s.borderTopLeftRadius,
        s.borderTopRightRadius,
        s.borderBottomLeftRadius,
        s.borderBottomRightRadius,
      ],
      top: s.borderTopWidth,
      left: s.borderLeftWidth,
      right: s.borderRightWidth,
    };
  });
  expect(style.radii).toEqual(["0px", "0px", "0px", "0px"]);
  expect(style.top).toBe("1px");
  expect(style.left).toBe("1px");
  expect(style.right).toBe("1px");
});

test("the iframe is light-scheme on a #1f1f1f container with square corners", async ({
  page,
}) => {
  await openPlayer(page);
  const iframe = page.locator("iframe");
  expect(await iframe.evaluate((el) => getComputedStyle(el).colorScheme)).toBe("light");
  expect(
    await iframe.evaluate((el) => getComputedStyle(el.parentElement!).backgroundColor),
  ).toBe("rgb(31, 31, 31)");
  expect(
    await iframe.evaluate((el) => {
      const s = getComputedStyle(el);
      return s.borderTopLeftRadius + s.borderBottomRightRadius;
    }),
  ).toBe("0px0px");
});

for (const theme of THEMES) {
  test(`no white pixels around the embed in the ${theme} theme`, async ({ page }) => {
    const strip = await openPlayer(page);
    if (theme !== "warm") {
      await page.locator("#command-prompt").fill(`:theme ${theme}`);
      await page.locator("#command-prompt").press("Enter");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    }
    await expect(page.locator("iframe")).toHaveCount(1);
    await expect(page.frameLocator("iframe").locator("body")).toContainText("stub embed");

    // The whole embed area (the iframe's container), border included.
    const container = page.locator("iframe").locator("xpath=..");
    const box = (await container.boundingBox())!;
    const wrapper = (await strip.boundingBox())!;
    const clip = {
      x: wrapper.x,
      y: box.y,
      width: wrapper.width,
      height: box.height + 1,
    };
    const png = await page.screenshot({ clip });
    expect(await countWhitePixels(page, png)).toBe(0);
  });
}
