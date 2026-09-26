import { build } from "esbuild";
import { rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const dist = resolve(root, "dist");
await rm(dist, { recursive: true, force: true });

const tsc = process.platform === "win32" ? "tsc.cmd" : "tsc";
const declarations = spawnSync(tsc, ["-p", "tsconfig.build.json"], {
  stdio: "inherit",
  cwd: root,
  shell: process.platform === "win32",
});

if (declarations.status !== 0)
  throw new Error("TypeScript declaration build failed.");

const entries = ["index", "core", "render", "control", "elements", "state", "store", "style", "colors"];

const common = {
  absWorkingDir: root,
  bundle: true,
  platform: "browser",
  target: "es2020",
  sourcemap: true,
  minify: true,
};

// Build ESM entry points together so classes and module state live in shared
// chunks instead of being copied into each public entry point.
const [esm] = await Promise.all([
  build({
    ...common,
    entryPoints: entries.map((entry) => `./${entry}.ts`),
    format: "esm",
    splitting: true,
    outdir: "dist",
    chunkNames: "chunks/[name]-[hash]",
    metafile: true,
  }),
  // CommonJS has no code splitting. Its subpaths re-export this one runtime.
  build({
    ...common,
    entryPoints: ["./index.ts"],
    format: "cjs",
    outfile: "dist/index.cjs",
  }),
]);

for (const entry of entries.filter((entry) => entry !== "index")) {
  const output = Object.values(esm.metafile.outputs).find(
    (output) => output.entryPoint && resolve(root, output.entryPoint) === resolve(root, `${entry}.ts`),
  );
  if (!output) throw new Error(`Missing ESM entry point: ${entry}`);
  // Use the actual runtime exports so type-only exports are omitted and each
  // CommonJS subpath exposes precisely the same API as its ESM counterpart.
  const lines = [
    '"use strict";',
    'const runtime = require("./index.cjs");',
    ...output.exports.map((name) =>
      `Object.defineProperty(exports, ${JSON.stringify(name)}, { enumerable: true, get: () => runtime[${JSON.stringify(name)}] });`,
    ),
  ];
  await writeFile(resolve(dist, `${entry}.cjs`), `${lines.join("\n")}\n`);
}

console.log("Built bundled ESM, CommonJS, and TypeScript declarations.");
