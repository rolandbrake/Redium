import { State } from "../state/State.js";
import { dimension, fontSize, opacity as opacityValue, pixels, type SizeValue } from "./Size.js";

export type ShadowSize = "sm" | "md" | "lg" | "xl";
export type Align = "start" | "center" | "end" | "between" | "around";
export type SpacingValue =
  | number
  | string
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];
export interface StyleConfig {
  width?: SizeValue;
  minWidth?: SizeValue;
  maxWidth?: SizeValue;
  height?: SizeValue;
  minHeight?: SizeValue;
  background?: string;
  color?: string;
  radius?: number;
  shadow?: ShadowSize;
  gap?: number;
  opacity?: number;
  cursor?: string;
  font?: number;
  weight?: number;
  padding?: SpacingValue;
  margin?: SpacingValue;
}
const shadows: Record<ShadowSize, string> = {
  sm: "0 1px 2px rgba(0,0,0,.05)",
  md: "0 4px 6px rgba(0,0,0,.1)",
  lg: "0 10px 15px rgba(0,0,0,.1)",
  xl: "0 20px 25px rgba(0,0,0,.15)",
};
const justify: Record<Align, string> = {
  start: "start",
  center: "center",
  end: "end",
  between: "space-between",
  around: "space-around",
};

/** A reusable, reactive style value. One style may be shared by many Elements. */
export class Style {
  private targets = new Set<HTMLElement>();
  private props = new Map<string, string>();
  constructor(config: StyleConfig = {}) {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined)
        (this as unknown as Record<string, (v: unknown) => void>)[key]?.(value);
    });
  }
  bind(target: HTMLElement): this {
    this.targets.add(target);
    this.props.forEach((v, k) => target.style.setProperty(k, v));
    return this;
  }
  value(prop: string): string | undefined {
    return this.props.get(prop);
  }
  remove(prop: string): this {
    this.props.delete(prop);
    this.targets.forEach((target) => target.style.removeProperty(prop));
    return this;
  }

  raw(prop: string, value: string): this {
    this.props.set(prop, value);
    this.targets.forEach((t) => t.style.setProperty(prop, value));
    return this;
  }
  width(v: SizeValue): this {
    return this.raw("width", dimension(v, "Width"));
  }
  maxWidth(v: SizeValue): this {
    return this.raw("max-width", dimension(v, "Max width"));
  }
  height(v: SizeValue): this {
    return this.raw("height", dimension(v, "Height"));
  }
  minWidth(v: SizeValue): this {
    return this.raw("min-width", dimension(v, "Min width"));
  }
  minHeight(v: SizeValue): this {
    return this.raw("min-height", dimension(v, "Min height"));
  }
  private spacing(v: SpacingValue, allowNegative = false): string {
    if (typeof v === "number") return pixels(v, "Spacing", allowNegative);
    if (typeof v === "string") return v;
    return v.map((value) => pixels(value, "Spacing", allowNegative)).join(" ");
  }
  pad(v: SpacingValue, h?: number): this {
    return this.raw(
      "padding",
      h === undefined ? this.spacing(v) : `${this.spacing(v)} ${pixels(h, "Padding")}`,
    );
  }
  margin(v: SpacingValue, h?: number): this {
    return this.raw(
      "margin",
      h === undefined ? this.spacing(v, true) : `${this.spacing(v, true)} ${pixels(h, "Margin", true)}`,
    );
  }
  padding(v: SpacingValue): this {
    return this.raw("padding", this.spacing(v));
  }
  gap(v: number): this {
    return this.raw("gap", pixels(v, "Gap"));
  }
  background(v: string): this {
    return this.raw("background-color", v);
  }
  color(v: string): this {
    return this.raw("color", v);
  }
  radius(v: number): this {
    return this.raw("border-radius", pixels(v, "Radius"));
  }
  shadow(v: ShadowSize): this {
    return this.raw("box-shadow", shadows[v]);
  }
  opacity(v: number): this {
    return this.raw("opacity", opacityValue(v));
  }
  cursor(v: string): this {
    return this.raw("cursor", v);
  }
  border(width: number, color: string): this {
    return this.raw("border", `${pixels(width, "Border width")} solid ${color}`);
  }
  font(size: number, weight?: number, family?: string): this {
    if (weight !== undefined) this.raw("font-weight", String(weight));
    if (family) this.raw("font-family", family);
    return this.raw("font-size", fontSize(size));
  }
  weight(value: number): this {
    return this.raw("font-weight", String(value));
  }
  row(align: Align = "start"): this {
    return this.raw("display", "grid")
      .raw("grid-auto-flow", "column")
      .raw("justify-content", justify[align]);
  }
  column(align: Align = "start"): this {
    return this.raw("display", "grid")
      .raw("grid-auto-flow", "row")
      .raw("justify-content", justify[align]);
  }
  center(): this {
    return this.raw("display", "grid").raw("place-items", "center");
  }
  fill(): this {
    return this.width(1).height(1);
  }
  transition(ms: number, easing = "ease"): this {
    return this.raw("transition", `all ${ms}ms ${easing}`);
  }
  when(
    condition: State<boolean>,
    apply: ((style: this) => void) | StyleConfig,
  ): this {
    const base = new Map(this.props);
    condition.subscribe((active) => {
      if (active) {
        if (typeof apply === "function") apply(this);
        else
          Object.entries(apply).forEach(([key, value]) => {
            if (value !== undefined)
              (this as unknown as Record<string, (v: unknown) => void>)[key]?.(
                value,
              );
          });
        return;
      }
      const activeKeys = new Set(this.props.keys());
      this.props = new Map(base);
      this.targets.forEach((target) => {
        activeKeys.forEach((key) => {
          if (!this.props.has(key)) target.style.removeProperty(key);
          else target.style.setProperty(key, this.props.get(key)!);
        });
      });
    });
    return this;
  }
}
