import { build } from "esbuild";
import { rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
await rm(dist, { recursive: true, force: true });

const tsc = process.platform === "win32" ? "tsc.cmd" : "tsc";
const declarations = spawnSync(tsc, ["-p", "tsconfig.build.json"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (declarations.status !== 0)
  throw new Error("TypeScript declaration build failed.");

const entries = ["index", "core", "render", "elements", "state", "style", "colors"];

await Promise.all(
  entries.flatMap((entry) => [
    build({
      absWorkingDir: root,
      entryPoints: [`./${entry}.ts`],
      bundle: true,
      format: "esm",
      platform: "browser",
      target: "es2020",
      outfile: `dist/${entry}.js`,
      sourcemap: true,
      minify: true,
    }),
    build({
      absWorkingDir: root,
      entryPoints: [`./${entry}.ts`],
      bundle: true,
      format: "cjs",
      platform: "browser",
      target: "es2020",
      outfile: `dist/${entry}.cjs`,
      sourcemap: true,
      minify: true,
    }),
  ]),
);

console.log("Built bundled ESM, CommonJS, and TypeScript declarations.");
