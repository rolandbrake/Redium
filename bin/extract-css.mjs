import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

class FakeStyle {
  values = new Map();
  setProperty(name, value) {
    this.values.set(name, String(value));
  }
  removeProperty(name) {
    this.values.delete(name);
  }
  getPropertyValue(name) {
    return this.values.get(name) ?? "";
  }
}

class FakeElement {
  style = new FakeStyle();
  children = [];
  parentElement = null;
  attributes = new Map();
  listeners = new Map();
  _textContent = "";
  className = "";
  id = "";
  constructor(tagName, ownerDocument) {
    this.tagName = tagName.toUpperCase();
    this.ownerDocument = ownerDocument;
  }
  get textContent() {
    return this._textContent;
  }
  set textContent(value) {
    this._textContent = String(value ?? "");
  }
  get classList() {
    return {
      add: (...names) => {
        const classes = new Set(this.className.split(/\s+/).filter(Boolean));
        names.forEach((name) => classes.add(name));
        this.className = [...classes].join(" ");
      },
      remove: (...names) => {
        const removed = new Set(names);
        this.className = this.className
          .split(/\s+/)
          .filter((name) => name && !removed.has(name))
          .join(" ");
      },
    };
  }
  appendChild(child) {
    return this.insertBefore(child, null);
  }
  insertBefore(child, reference) {
    if (child.parentElement) child.parentElement.removeChild(child);
    const index =
      reference === null
        ? this.children.length
        : this.children.indexOf(reference);
    this.children.splice(index < 0 ? this.children.length : index, 0, child);
    child.parentElement = this;
    return child;
  }
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) this.children.splice(index, 1);
    child.parentElement = null;
    return child;
  }
  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }
  addEventListener(name, listener) {
    if (!this.listeners.has(name)) this.listeners.set(name, new Set());
    this.listeners.get(name).add(listener);
  }
  removeEventListener(name, listener) {
    this.listeners.get(name)?.delete(listener);
  }
}

function createDocument() {
  const document = {
    head: undefined,
    body: undefined,
    createElement(tagName) {
      return new FakeElement(tagName, document);
    },
    // Vite's module-preload helper probes links on startup. Extracting styles
    // does not fetch application assets, so an empty result is sufficient.
    querySelectorAll() {
      return [];
    },
    getElementById(id) {
      const visit = (node) =>
        node.id === id ? node : node.children.map(visit).find(Boolean);
      return visit(document.head) ?? visit(document.body) ?? null;
    },
  };
  document.head = document.createElement("head");
  document.body = document.createElement("body");
  return document;
}

class FakeMutationObserver {
  constructor() {}
  observe() {}
  disconnect() {}
}

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const path = resolve(directory, entry.name);
        return entry.isDirectory() ? files(path) : [path];
      }),
    )
  ).flat();
}

function outputScriptPaths(html, outputDirectory) {
  return [
    ...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi),
  ]
    .map((match) => match[1].replace(/[?#].*$/, ""))
    .filter((source) => source.endsWith(".js"))
    .map((source) => resolve(outputDirectory, source.replace(/^\/+/, "")));
}

function rulesFrom(document) {
  const rules = new Map();
  for (const style of document.head.children) {
    if (
      style.tagName !== "STYLE" ||
      style.getAttribute("data-redium-styles") === null
    )
      continue;
    for (const match of style.textContent.matchAll(/\.([^.{]+)\{([^}]*)\}/g)) {
      const key = match[2];
      rules.set(key, match[1]);
    }
  }
  return rules;
}

export async function extractCss(outputDirectory) {
  const document = createDocument();
  Object.assign(globalThis, {
    document,
    window: globalThis,
    HTMLElement: FakeElement,
    Element: FakeElement,
    Node: FakeElement,
    MutationObserver: FakeMutationObserver,
    __REDIUM_EXTRACTING__: true,
  });

  const htmlFiles = (await files(outputDirectory)).filter((path) =>
    path.endsWith(".html"),
  );
  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    for (const script of outputScriptPaths(html, outputDirectory))
      await import(`${pathToFileURL(script).href}?redium-css-extraction`);
  }

  const rules = rulesFrom(document);
  if (!rules.size) return 0;
  const css = [...rules.entries()]
    .map(([key, name]) => `.${name}{${key}}`)
    .join("");
  const name = `redium-${createHash("sha256").update(css).digest("hex").slice(0, 8)}.css`;
  const cssPath = resolve(outputDirectory, "assets", name);
  await writeFile(cssPath, css);
  // Keep style values from terminating the inline JSON assignment when a
  // value happens to contain HTML-significant characters.
  const ruleTable = JSON.stringify(Object.fromEntries(rules)).replace(
    /</g,
    "\\u003c",
  );

  for (const htmlFile of htmlFiles) {
    const html = await readFile(htmlFile, "utf8");
    const href = relative(dirname(htmlFile), cssPath).replaceAll("\\", "/");
    const tags = `<link rel="stylesheet" data-redium-styles href="${href}" /><script>globalThis.__REDIUM_EXTRACTED_RULES__=${ruleTable}</script>`;
    await writeFile(htmlFile, html.replace("</head>", `${tags}</head>`));
  }
  return rules.size;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  const outputDirectory = resolve(process.cwd(), process.argv[2] ?? "dist");
  try {
    const count = await extractCss(outputDirectory);
    console.log(`Extracted ${count} Redium CSS rule${count === 1 ? "" : "s"}.`);
  } catch (error) {
    console.warn(
      "Redium could not extract CSS; the runtime stylesheet will be used.",
    );
    console.warn(error instanceof Error ? error.message : error);
  }
  // Application mount hooks may start timers or retain other browser-like
  // handles. Extraction is complete at this point, so they must not hold the
  // build process open.
  process.exit(0);
}
