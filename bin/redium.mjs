#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const [command = "dev", ...args] = process.argv.slice(2);
const supportedCommands = new Set(["dev", "build", "preview"]);
const cliDirectory = dirname(fileURLToPath(import.meta.url));

function buildOutputDirectory(args) {
  const index = args.findIndex((arg) => arg === "--outDir" || arg === "-o");
  if (index >= 0 && args[index + 1]) return args[index + 1];
  const inline = args.find((arg) => arg.startsWith("--outDir="));
  return inline ? inline.slice("--outDir=".length) : "dist";
}

if (!supportedCommands.has(command)) {
  console.error(`Unknown Redium command: ${command}`);
  console.error("Usage: redium <dev|build|preview> [Vite options]");
  process.exitCode = 1;
} else {
  // Resolve Vite from the application that invoked Redium. This keeps Vite a
  // project-owned tool and lets its normal vite.config.ts control the build.
  const fromProject = createRequire(resolve(process.cwd(), "redium-cli.cjs"));
  let viteCli;

  try {
    const vitePackage = fromProject.resolve("vite/package.json");
    viteCli = resolve(dirname(vitePackage), "bin/vite.js");
  } catch {
    console.error("Redium needs Vite to run this command.");
    console.error("Install it in this project with: npm install --save-dev vite");
    process.exitCode = 1;
  }

  if (viteCli) {
    const child = spawn(process.execPath, [viteCli, command, ...args], {
      cwd: process.cwd(),
      stdio: "inherit",
    });

    child.on("error", (error) => {
      console.error(error);
      process.exitCode = 1;
    });

    child.on("exit", (code, signal) => {
      if (signal) process.kill(process.pid, signal);
      else if (code) process.exitCode = code;
      else if (command !== "build") process.exitCode = 0;
      else {
        const extractor = spawn(
          process.execPath,
          [resolve(cliDirectory, "extract-css.mjs"), buildOutputDirectory(args)],
          { cwd: process.cwd(), stdio: "inherit" },
        );
        extractor.on("error", (error) => {
          console.warn("Redium could not extract CSS; the runtime stylesheet will be used.");
          console.warn(error);
        });
        extractor.on("exit", (extractCode) => { process.exitCode = extractCode ?? 1; });
      }
    });
  }
}
