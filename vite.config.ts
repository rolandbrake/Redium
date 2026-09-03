import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      redium: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
});
