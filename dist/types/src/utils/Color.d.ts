/** Immutable color helpers used by the framework styling API. */
export type RGB = readonly [r: number, g: number, b: number];
export type RGBA = readonly [r: number, g: number, b: number, a: number];
export declare class Color {
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
    static rgb(r: number, g: number, b: number): string;
    static rgba(r: number, g: number, b: number, a: number): string;
    static hsl(h: number, s: number, l: number): string;
    static hsla(h: number, s: number, l: number, a: number): string;
    /** Normalize 3, 4, 6, or 8 digit hexadecimal colors. */
    static hex(value: string): string;
    static parse(value: string): RGB;
    static mix(first: string, second: string, amount?: number): string;
    static lighten(value: string, amount?: number): string;
    static darken(value: string, amount?: number): string;
}
export declare const rgb: typeof Color.rgb;
export declare const rgba: typeof Color.rgba;
export declare const hex: typeof Color.hex;
export default Color;
//# sourceMappingURL=Color.d.ts.map