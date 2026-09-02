/** Immutable color helpers used by the framework styling API. */
export type RGB = readonly [r: number, g: number, b: number];
export type RGBA = readonly [r: number, g: number, b: number, a: number];

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const channel = (value: number): number => Math.round(clamp(value, 0, 255));
const alpha = (value: number): number => Number(clamp(value, 0, 1).toFixed(3));

export class Color {
  static readonly white = "#ffffff";
  static readonly black = "#000000";

  static readonly red = "#ef4444";
  static readonly orange = "#f97316";
  static readonly amber = "#f59e0b";
  static readonly yellow = "#eab308";
  static readonly lime = "#84cc16";
  static readonly green = "#22c55e";
  static readonly emerald = "#10b981";
  static readonly teal = "#14b8a6";
  static readonly cyan = "#06b6d4";
  static readonly sky = "#0ea5e9";
  static readonly blue = "#3b82f6";
  static readonly indigo = "#6366f1";
  static readonly violet = "#8b5cf6";
  static readonly purple = "#a855f7";
  static readonly fuchsia = "#d946ef";
  static readonly pink = "#ec4899";
  static readonly rose = "#f43f5e";

  static readonly gray = "#6b7280";
  static readonly slate = "#64748b";
  static readonly zinc = "#71717a";
  static readonly neutral = "#737373";
  static readonly stone = "#78716c";

  static rgb(r: number, g: number, b: number): string {
    return `rgb(${channel(r)}, ${channel(g)}, ${channel(b)})`;
  }

  static rgba(r: number, g: number, b: number, a: number): string {
    return `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, ${alpha(a)})`;
  }

  static hsl(h: number, s: number, l: number): string {
    return `hsl(${((h % 360) + 360) % 360}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%)`;
  }

  static hsla(h: number, s: number, l: number, a: number): string {
    return `hsla(${((h % 360) + 360) % 360}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%, ${alpha(a)})`;
  }

  /** Normalize 3, 4, 6, or 8 digit hexadecimal colors. */
  static hex(value: string): string {
    const normalized = value.trim().replace(/^#/, "").toLowerCase();
    if (
      ![3, 4, 6, 8].includes(normalized.length) ||
      !/^[\da-f]+$/i.test(normalized)
    ) {
      throw new Error(`Invalid hexadecimal color: ${value}`);
    }
    const expanded =
      normalized.length === 3 || normalized.length === 4
        ? normalized
            .split("")
            .map((part) => part + part)
            .join("")
        : normalized;
    return `#${expanded}`;
  }

  static parse(value: string): RGB {
    const hex = Color.hex(value).slice(1);
    const rgb = hex.length === 8 ? hex.slice(0, 6) : hex;
    return [
      Number.parseInt(rgb.slice(0, 2), 16),
      Number.parseInt(rgb.slice(2, 4), 16),
      Number.parseInt(rgb.slice(4, 6), 16),
    ];
  }

  static mix(first: string, second: string, amount = 0.5): string {
    const a = Color.parse(first);
    const b = Color.parse(second);
    const t = clamp(amount, 0, 1);
    return Color.rgb(
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    );
  }

  static lighten(value: string, amount = 0.1): string {
    return Color.mix(value, "#ffffff", amount);
  }
  static darken(value: string, amount = 0.1): string {
    return Color.mix(value, "#000000", amount);
  }
}

export const rgb = Color.rgb;
export const rgba = Color.rgba;
export const hex = Color.hex;
export default Color;
