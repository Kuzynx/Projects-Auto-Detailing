import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const alias = { "@": fileURLToPath(new URL("./src", import.meta.url)) };

/**
 * Unit tests live next to the code in `__tests__` folders.
 * - `*.test.ts`  -> node environment (pure logic: utils, SEO builders, schemas)
 * - `*.test.tsx` -> jsdom + Testing Library (components)
 * Playwright specs in `e2e/` are excluded; run them with `pnpm test:e2e`.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    passWithNoTests: true,
    projects: [
      {
        extends: true,
        test: {
          name: "node",
          environment: "node",
          include: ["src/**/*.test.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "dom",
          environment: "jsdom",
          include: ["src/**/*.test.tsx"],
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});
