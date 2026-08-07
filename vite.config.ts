/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Vite + Vitest config.
 * - base: repo name for GitHub Pages asset paths
 * - exclude web-llm from prebundle (large WASM / workers)
 * - esnext target for modern WebGPU browsers
 */
export default defineConfig({
  plugins: [react()],
  // https://USER.github.io/raio-deslinkedinzador/
  base: "/raio-deslinkedinzador/",
  build: {
    target: "esnext",
    // WebLLM-related chunks are large by nature.
    chunkSizeWarningLimit: 7000,
  },
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["@mlc-ai/web-llm"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/main.tsx", "src/test/**", "src/**/*.d.ts"],
    },
  },
});
