import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

test.describe("language parity", () => {
  test("[C12] a missing translatable field, dictionary entry or command text is a type error", () => {
    const file = path.join(__dirname, "../types/parity.test-d.ts");
    const source = fs.readFileSync(file, "utf8");
    // Each directive below is only valid while TypeScript really reports an
    // error on the next line, so `tsc` passing means all of them are rejected.
    expect(source.match(/@ts-expect-error/g)?.length).toBeGreaterThanOrEqual(8);
    expect(() =>
      execFileSync("npx", ["tsc", "--noEmit"], {
        cwd: path.join(__dirname, "../.."),
        stdio: "pipe",
      }),
    ).not.toThrow();
  });
});
