import type { AbsoluteValue } from "./Size.js";

export const BorderStyle = Object.freeze({
  solid: "solid",
  dashed: "dashed",
  dotted: "dotted",
  double: "double",
  groove: "groove",
  ridge: "ridge",
  inset: "inset",
  outset: "outset",
} as const);

export type BorderStyle = (typeof BorderStyle)[keyof typeof BorderStyle];

export interface BorderValue {
  readonly kind: "border";
  readonly width: AbsoluteValue;
  readonly style: BorderStyle;
  readonly color: string;
}

function createBorder(width: AbsoluteValue, color: string, style: BorderStyle = BorderStyle.solid): BorderValue {
  if (typeof width === "number" && (!Number.isFinite(width) || width < 0))
    throw new Error("Border width must be a non-negative finite number.");
  if (typeof color !== "string" || color.trim() === "")
    throw new Error("Border color must be a non-empty string.");
  if (!Object.values(BorderStyle).includes(style))
    throw new Error("Invalid border style.");
  return Object.freeze({ kind: "border", width, style, color });
}

export interface BorderFactory {
  (width: AbsoluteValue, color: string, style?: BorderStyle): BorderValue;
}

export const Border = createBorder as BorderFactory;
