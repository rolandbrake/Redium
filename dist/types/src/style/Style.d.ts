import { State } from "../state/State.js";
import { type SizeValue } from "./Size.js";
export type ShadowSize = "sm" | "md" | "lg" | "xl";
export type Align = "start" | "center" | "end" | "between" | "around";
export type SpacingValue = number | string | [number, number] | [number, number, number] | [number, number, number, number];
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
/** A reusable, reactive style value. One style may be shared by many Elements. */
export declare class Style {
    private targets;
    private props;
    constructor(config?: StyleConfig);
    bind(target: HTMLElement): this;
    value(prop: string): string | undefined;
    remove(prop: string): this;
    raw(prop: string, value: string): this;
    width(v: SizeValue): this;
    maxWidth(v: SizeValue): this;
    height(v: SizeValue): this;
    minWidth(v: SizeValue): this;
    minHeight(v: SizeValue): this;
    private spacing;
    pad(v: SpacingValue, h?: number): this;
    margin(v: SpacingValue, h?: number): this;
    padding(v: SpacingValue): this;
    gap(v: number): this;
    background(v: string): this;
    color(v: string): this;
    radius(v: number): this;
    shadow(v: ShadowSize): this;
    opacity(v: number): this;
    cursor(v: string): this;
    border(width: number, color: string): this;
    font(size: number, weight?: number, family?: string): this;
    weight(value: number): this;
    row(align?: Align): this;
    column(align?: Align): this;
    center(): this;
    fill(): this;
    transition(ms: number, easing?: string): this;
    when(condition: State<boolean>, apply: ((style: this) => void) | StyleConfig): this;
}
//# sourceMappingURL=Style.d.ts.map