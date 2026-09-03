export interface ShadowValue {
  readonly kind: "shadow";
  readonly x: number;
  readonly y: number;
  readonly blur: number;
  readonly spread: number;
  readonly color: string;
  readonly inset: boolean;
}

function finite(value: number, name: string): number {
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
  return value;
}

function createShadow(x: number, y: number, blur: number, spread: number, color: string, inset = false): ShadowValue {
  finite(x, "Shadow x offset");
  finite(y, "Shadow y offset");
  finite(blur, "Shadow blur");
  finite(spread, "Shadow spread");
  if (blur < 0) throw new Error("Shadow blur cannot be negative.");
  if (typeof color !== "string" || color.trim() === "")
    throw new Error("Shadow color must be a non-empty string.");
  return Object.freeze({ kind: "shadow", x, y, blur, spread, color, inset });
}

export interface ShadowFactory {
  (x: number, y: number, blur: number, spread: number, color: string, inset?: boolean): ShadowValue;
  sm: ShadowValue;
  md: ShadowValue;
  lg: ShadowValue;
  xl: ShadowValue;
}

export const Shadow = Object.assign(createShadow, {
  sm: createShadow(0, 1, 2, 0, "rgba(0, 0, 0, 0.05)"),
  md: createShadow(0, 4, 6, 0, "rgba(0, 0, 0, 0.1)"),
  lg: createShadow(0, 10, 15, 0, "rgba(0, 0, 0, 0.1)"),
  xl: createShadow(0, 20, 25, 0, "rgba(0, 0, 0, 0.15)"),
}) as ShadowFactory;
