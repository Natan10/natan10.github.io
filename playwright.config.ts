import { defineConfig, devices } from "@playwright/test";

// Each worktree can set PORT so parallel runs never reuse another checkout's server.
const PORT = Number(process.env.PORT ?? 3100);
const useExistingExport = process.env.PLAYWRIGHT_USE_EXISTING_EXPORT === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  // Tests run against the same static export uploaded to GitHub Pages.
  webServer: {
    command: `${useExistingExport ? "" : "npm run build && "}PORT=${PORT} npm run start`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
