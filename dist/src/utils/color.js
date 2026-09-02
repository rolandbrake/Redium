const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const channel = (value) => Math.round(clamp(value, 0, 255));
const alpha = (value) => Number(clamp(value, 0, 1).toFixed(3));
export class Color {
    static rgb(r, g, b) {
        return `rgb(${channel(r)}, ${channel(g)}, ${channel(b)})`;
    }
    static rgba(r, g, b, a) {
        return `rgba(${channel(r)}, ${channel(g)}, ${channel(b)}, ${alpha(a)})`;
    }
    static hsl(h, s, l) {
        return `hsl(${((h % 360) + 360) % 360}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%)`;
    }
    static hsla(h, s, l, a) {
        return `hsla(${((h % 360) + 360) % 360}, ${clamp(s, 0, 100)}%, ${clamp(l, 0, 100)}%, ${alpha(a)})`;
    }
    /** Normalize 3, 4, 6, or 8 digit hexadecimal colors. */
    static hex(value) {
        const normalized = value.trim().replace(/^#/, "").toLowerCase();
        if (![3, 4, 6, 8].includes(normalized.length) ||
            !/^[\da-f]+$/i.test(normalized)) {
            throw new Error(`Invalid hexadecimal color: ${value}`);
        }
        const expanded = normalized.length === 3 || normalized.length === 4
            ? normalized
                .split("")
                .map((part) => part + part)
                .join("")
            : normalized;
        return `#${expanded}`;
    }
    static parse(value) {
        const hex = Color.hex(value).slice(1);
        const rgb = hex.length === 8 ? hex.slice(0, 6) : hex;
        return [
            Number.parseInt(rgb.slice(0, 2), 16),
            Number.parseInt(rgb.slice(2, 4), 16),
            Number.parseInt(rgb.slice(4, 6), 16),
        ];
    }
    static mix(first, second, amount = 0.5) {
        const a = Color.parse(first);
        const b = Color.parse(second);
        const t = clamp(amount, 0, 1);
        return Color.rgb(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
    }
    static lighten(value, amount = 0.1) {
        return Color.mix(value, "#ffffff", amount);
    }
    static darken(value, amount = 0.1) {
        return Color.mix(value, "#000000", amount);
    }
}
Color.white = "#ffffff";
Color.black = "#000000";
Color.red = "#ef4444";
Color.orange = "#f97316";
Color.amber = "#f59e0b";
Color.yellow = "#eab308";
Color.lime = "#84cc16";
Color.green = "#22c55e";
Color.emerald = "#10b981";
Color.teal = "#14b8a6";
Color.cyan = "#06b6d4";
Color.sky = "#0ea5e9";
Color.blue = "#3b82f6";
Color.indigo = "#6366f1";
Color.violet = "#8b5cf6";
Color.purple = "#a855f7";
Color.fuchsia = "#d946ef";
Color.pink = "#ec4899";
Color.rose = "#f43f5e";
Color.gray = "#6b7280";
Color.slate = "#64748b";
Color.zinc = "#71717a";
Color.neutral = "#737373";
Color.stone = "#78716c";
export const rgb = Color.rgb;
export const rgba = Color.rgba;
export const hex = Color.hex;
export default Color;
