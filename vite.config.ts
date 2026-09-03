import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: [
      { find: "redium/core", replacement: fileURLToPath(new URL("./core.ts", import.meta.url)) },
      { find: "redium/render", replacement: fileURLToPath(new URL("./render.ts", import.meta.url)) },
      { find: "redium/elements", replacement: fileURLToPath(new URL("./elements.ts", import.meta.url)) },
      { find: "redium/state", replacement: fileURLToPath(new URL("./state.ts", import.meta.url)) },
      { find: "redium/style", replacement: fileURLToPath(new URL("./style.ts", import.meta.url)) },
      { find: "redium/colors", replacement: fileURLToPath(new URL("./colors.ts", import.meta.url)) },
      { find: /^redium$/, replacement: fileURLToPath(new URL("./src/index.ts", import.meta.url)) },
    ],
  },
});
