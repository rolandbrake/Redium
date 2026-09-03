import type { UnitValue } from "./Unit.js";

/** Values that can be used by dimensions and CSS sizing functions. */
export type Relative = number;
export type Absolute = number;
declare const cssFunctionBrand: unique symbol;
export type CSSFunction = string & { readonly [cssFunctionBrand]: true };
export type SizeValue = number | CSSFunction | UnitValue;
const generatedCssValues = new Set<string>();

function cssValue(value: string): CSSFunction {
  generatedCssValues.add(value);
  return value as CSSFunction;
}

function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
  return value;
}

export function px(value: number): CSSFunction {
  return cssValue(`${finite(value, "Pixel value")}px`);
}

export function ratio(value: number): CSSFunction {
  finite(value, "Relative value");
  if (value < 0 || value > 1)
    throw new Error("Relative value must be between 0 and 1.");
  return cssValue(`${value * 100}%`);
}

/** Converts a dimension number: 0..1 is relative, values above 1 are pixels. */
export function dimension(value: SizeValue, property = "Dimension"): string {
  if (typeof value === "object") {
    if (value.unit === "ratio") return ratio(value.value);
    if (value.unit === "px") return px(value.value);
    return `${value.value}rem`;
  }
  if (typeof value !== "number") {
    if (!generatedCssValues.has(value))
      throw new Error(`${property} must use a Redium sizing helper, not a raw CSS string.`);
    return value;
  }
  finite(value, property);
  if (value < 0)
    throw new Error(`${property} cannot be negative.`);
  return value <= 1 ? ratio(value) : px(value);
}

/** Converts a value whose unit is always logical CSS pixels. */
export function pixels(value: number, property = "Pixel value", allowNegative = false): string {
  finite(value, property);
  if (!allowNegative && value < 0) throw new Error(`${property} cannot be negative.`);
  return px(value);
}

/** Converts the framework's absolute font size to rem using the 16px root. */
export function fontSize(value: number): string {
  finite(value, "Font size");
  if (value < 0) throw new Error("Font size cannot be negative.");
  return `${value / 16}rem`;
}

export function opacity(value: number): string {
  finite(value, "Opacity");
  if (value < 0 || value > 1)
    throw new Error("Opacity must be between 0 and 1.");
  return String(value);
}

function valueOf(value: SizeValue): string {
  return dimension(value);
}

export function min(...values: SizeValue[]): CSSFunction {
  return cssValue(`min(${values.map(valueOf).join(", ")})`);
}
export function max(...values: SizeValue[]): CSSFunction {
  return cssValue(`max(${values.map(valueOf).join(", ")})`);
}
export function clamp(minimum: SizeValue, preferred: SizeValue, maximum: SizeValue): CSSFunction {
  return cssValue(`clamp(${valueOf(minimum)}, ${valueOf(preferred)}, ${valueOf(maximum)})`);
}
