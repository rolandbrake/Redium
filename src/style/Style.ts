import {
  dimension,
  fontSize,
  opacity as opacityValue,
  pixels,
  ratio,
  type AbsoluteValue,
  type SizeValue,
} from "./Size.js";
import type { ShadowValue } from "./Shadow.js";
import type { BorderValue } from "./Border.js";

export const Align = Object.freeze({
  start: "start",
  center: "center",
  end: "end",
  between: "between",
  around: "around",
} as const);
export type Align = (typeof Align)[keyof typeof Align];
export type SpacingValue =
  | AbsoluteValue
  | [AbsoluteValue, AbsoluteValue]
  | [AbsoluteValue, AbsoluteValue, AbsoluteValue]
  | [AbsoluteValue, AbsoluteValue, AbsoluteValue, AbsoluteValue];
export interface StyleConfig {
  width?: SizeValue;
  minWidth?: SizeValue;
  maxWidth?: SizeValue;
  height?: SizeValue;
  minHeight?: SizeValue;
  maxHeight?: SizeValue;
  background?: string;
  color?: string;
  radius?: number;
  shadow?: ShadowValue;
  border?: BorderValue;
  gap?: AbsoluteValue;
  opacity?: number;
  zIndex?: number;
  cursor?: string;
  font?: number;
  weight?: number;
  padding?: SpacingValue;
  margin?: SpacingValue;
}
const justify: Record<Align, string> = {
  start: "start",
  center: "center",
  end: "end",
  between: "space-between",
  around: "space-around",
};

// Implementation details are deliberately absent from the public entry points.
interface StyleData {
  props: Map<string, string>;
  defaults: Map<string, string>;
  targets: Set<HTMLElement>;
  targetClasses: WeakMap<HTMLElement, string>;
  children: Set<Style>;
  source?: Style;
}
const data = new WeakMap<Style, StyleData>();

interface StyleSheetRegistry {
  readonly rules: Map<string, string>;
  readonly names: Map<string, string>;
  readonly element: HTMLStyleElement;
}

const sheets = new WeakMap<Document, StyleSheetRegistry>();

type ExtractedRules = Record<string, string>;

function extractedRule(key: string): string | undefined {
  // `redium build` places this table next to its emitted stylesheet. Keeping
  // the keys (rather than only the CSS text) lets the browser skip creating a
  // runtime <style> element for rules already present in that file.
  const rules = (globalThis as typeof globalThis & {
    __REDIUM_EXTRACTED_RULES__?: ExtractedRules;
  }).__REDIUM_EXTRACTED_RULES__;
  return rules?.[key];
}

function hash(value: string): string {
  // FNV-1a is small, deterministic, and sufficient for private CSS names.
  let result = 0x811c9dc5;
  for (let index = 0; index < value.length; index++) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 0x01000193);
  }
  return (result >>> 0).toString(36);
}

function sheetFor(target: HTMLElement): StyleSheetRegistry {
  const doc = target.ownerDocument ?? document;
  const existing = sheets.get(doc);
  if (existing) return existing;

  const element = doc.createElement("style");
  element.setAttribute("data-redium-styles", "");
  (doc.head ?? doc.body).appendChild(element);
  const registry = { rules: new Map(), names: new Map(), element };
  sheets.set(doc, registry);
  return registry;
}

function ruleFor(target: HTMLElement, current: Map<string, string>): string | undefined {
  if (!current.size) return undefined;
  const declarations = [...current.entries()].sort(([left], [right]) => left.localeCompare(right));
  const key = declarations.map(([property, value]) => `${property}:${value}`).join(";");
  const extracted = extractedRule(key);
  if (extracted) return extracted;
  const sheet = sheetFor(target);
  const cached = sheet.rules.get(key);
  if (cached) return cached;

  const base = `r-${hash(key)}`;
  let name = base;
  let suffix = 1;
  while (sheet.names.has(name) && sheet.names.get(name) !== key)
    name = `${base}-${suffix++}`;
  const rule = `.${name}{${declarations.map(([property, value]) => `${property}:${value}`).join(";")}}`;
  sheet.rules.set(key, name);
  sheet.names.set(name, key);
  sheet.element.textContent += rule;
  return name;
}

function replaceClass(target: HTMLElement, previous: string | undefined, next: string | undefined): void {
  if (previous === next) return;
  if (previous) target.classList.remove(previous);
  if (next) target.classList.add(next);
}

function values(style: Style): Map<string, string> {
  const record = data.get(style)!;
  return new Map([
    ...record.defaults,
    ...(record.source ? values(record.source) : []),
    ...record.props,
  ]);
}
function refresh(style: Style): void {
  const record = data.get(style)!;
  const current = values(style);
  for (const target of record.targets) {
    const next = ruleFor(target, current);
    const previous = record.targetClasses.get(target);
    replaceClass(target, previous, next);
    if (next) record.targetClasses.set(target, next);
    else record.targetClasses.delete(target);
  }
  record.children.forEach(refresh);
}
interface StyleAccess {
  raw(property: string, value: string): StyleAccess;
  default(property: string, value: string): StyleAccess;
  value(property: string): string | undefined;
  bind(target: HTMLElement): Style;
  fork(): Style;
}
/** @internal Browser/style operations for Redium's own elements. */
export function styles(style: Style): StyleAccess {
  const record = data.get(style)!;
  return {
    raw(property: string, value: string) {
      record.props.set(property, value);
      refresh(style);
      return this;
    },
    default(property: string, value: string) {
      record.defaults.set(property, value);
      refresh(style);
      return this;
    },
    value(property: string) { return values(style).get(property); },
    bind(target: HTMLElement) {
      record.targets.add(target);
      refresh(style);
      return style;
    },
    fork() {
      const local = new Style();
      data.get(local)!.source = style;
      record.children.add(local);
      return local;
    },
  };
}

/** Reusable appearance; element-specific defaults never modify its source. */
export class Style {
  constructor(config: StyleConfig = {}) {
    data.set(this, {
      props: new Map(),
      defaults: new Map(),
      targets: new Set(),
      targetClasses: new WeakMap(),
      children: new Set(),
    });
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined)
        (this as unknown as Record<string, (v: unknown) => void>)[key]?.(value);
    });
  }
  #write(property: string, value: string): this {
    styles(this).raw(property, value);
    return this;
  }
  width(v: SizeValue): this {
    return this.#write("width", dimension(v, "Width"));
  }
  maxWidth(v: SizeValue): this {
    return this.#write("max-width", dimension(v, "Max width"));
  }
  height(v: SizeValue): this {
    return this.#write("height", dimension(v, "Height"));
  }
  minWidth(v: SizeValue): this {
    return this.#write("min-width", dimension(v, "Min width"));
  }
  minHeight(v: SizeValue): this {
    return this.#write("min-height", dimension(v, "Min height"));
  }
  private spacing(v: SpacingValue, allowNegative = false): string {
    if (!Array.isArray(v)) return pixels(v, "Spacing", allowNegative);
    return v.map((value) => pixels(value, "Spacing", allowNegative)).join(" ");
  }
  pad(v: SpacingValue, h?: AbsoluteValue): this {
    return this.#write(
      "padding",
      h === undefined
        ? this.spacing(v)
        : `${this.spacing(v)} ${pixels(h, "Padding")}`,
    );
  }
  margin(v: SpacingValue, h?: AbsoluteValue): this {
    return this.#write(
      "margin",
      h === undefined
        ? this.spacing(v, true)
        : `${this.spacing(v, true)} ${pixels(h, "Margin", true)}`,
    );
  }
  padding(v: SpacingValue): this {
    return this.#write("padding", this.spacing(v));
  }
  gap(v: AbsoluteValue): this {
    return this.#write("gap", pixels(v, "Gap"));
  }
  background(v: string): this {
    return this.#write("background-color", v);
  }
  color(v: string): this {
    return this.#write("color", v);
  }
  radius(v: AbsoluteValue): this {
    return this.#write("border-radius", pixels(v, "Radius"));
  }
  shadow(v: ShadowValue): this {
    if (v.kind !== "shadow") throw new Error("Invalid shadow value.");
    const inset = v.inset ? "inset " : "";
    return this.#write(
      "box-shadow",
      `${inset}${v.x}px ${v.y}px ${v.blur}px ${v.spread}px ${v.color}`,
    );
  }
  opacity(v: number): this {
    return this.#write("opacity", opacityValue(v));
  }
  zIndex(value: number): this {
    if (!Number.isInteger(value)) throw new Error("Z-index must be an integer.");
    return this.#write("z-index", String(value));
  }
  cursor(v: string): this {
    return this.#write("cursor", v);
  }
  border(v: BorderValue): this {
    if (v.kind !== "border") throw new Error("Invalid border value.");
    return this.#write(
      "border",
      `${pixels(v.width, "Border width")} ${v.style} ${v.color}`,
    );
  }
  font(size: number, weight?: number, family?: string): this {
    if (weight !== undefined) this.#write("font-weight", String(weight));
    if (family) this.#write("font-family", family);
    return this.#write("font-size", fontSize(size));
  }
  weight(value: number): this {
    return this.#write("font-weight", String(value));
  }
  row(align: Align = Align.start): this {
    return this.#write("display", "flex")
      .#write("flex-direction", "row")
      .#write("justify-content", justify[align]);
  }
  column(align: Align = Align.start): this {
    return this.#write("display", "flex")
      .#write("flex-direction", "column")
      .#write("justify-content", justify[align]);
  }
  center(): this {
    return this.#write("display", "grid").#write("place-items", "center");
  }
  fill(): this {
    return this.width(ratio(1)).height(ratio(1));
  }
}
