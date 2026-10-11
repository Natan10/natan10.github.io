import { expect, test, type Page } from "@playwright/test";
import { getContent } from "@/content";
import { shared } from "@/content/shared";

const PLAYLIST_ID = "4lrm0AHTGIV9BH77rG8qVt";
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}`;

const pages = [
  { path: "/", label: "Spotify playlist" },
  { path: "/pt", label: "Playlist no Spotify" },
] as const;

function trackSpotifyRequests(page: Page): string[] {
  const urls: string[] = [];
  page.on("request", (request) => {
    if (/(^|\.)spotify\.com$|(^|\.)scdn\.co$/.test(new URL(request.url()).hostname)) {
      urls.push(request.url());
    }
  });
  return urls;
}

test.describe("playlist in the shared content", () => {
  test("the id is stored once and both URLs derive from it, without a share token", () => {
    expect(shared.music.playlistId).toBe(PLAYLIST_ID);
    for (const language of ["en", "pt"] as const) {
      const { playlist } = getContent(language);
      expect(playlist.url).toBe(PLAYLIST_URL);
      const embed = new URL(playlist.embedUrl);
      expect(`${embed.origin}${embed.pathname}`).toBe(
        `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`,
      );
      expect(embed.searchParams.get("theme")).toBe("0");
      expect(embed.searchParams.has("si")).toBe(false);
      expect(playlist.url).not.toContain("si=");
    }
  });
});

for (const javaScriptEnabled of [true, false]) {
  test.describe(`Spotify playlist link (JavaScript ${javaScriptEnabled ? "on" : "off"})`, () => {
    test.use({ javaScriptEnabled });

    for (const { path, label } of pages) {
      test(`${path} Contact has the "${label}" link to the public playlist`, async ({
        page,
      }) => {
        const spotify = trackSpotifyRequests(page);
        await page.goto(path);
        const link = page.locator("#contact").getByRole("link", { name: label, exact: true });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", PLAYLIST_URL);
        await expect(page.locator("iframe")).toHaveCount(0);
        expect(spotify).toEqual([]);
      });
    }

    test("the page stays readable", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("#contact")).toContainText("[CMD: /contact]");
      await expect(page.locator("#contact")).toContainText("linkedin.com/in/natan-moreira");
    });
  });
}
