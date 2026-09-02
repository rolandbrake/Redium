import { dimension, fontSize, opacity as opacityValue, pixels } from "./Size.js";
const shadows = {
    sm: "0 1px 2px rgba(0,0,0,.05)",
    md: "0 4px 6px rgba(0,0,0,.1)",
    lg: "0 10px 15px rgba(0,0,0,.1)",
    xl: "0 20px 25px rgba(0,0,0,.15)",
};
const justify = {
    start: "start",
    center: "center",
    end: "end",
    between: "space-between",
    around: "space-around",
};
/** A reusable, reactive style value. One style may be shared by many Elements. */
export class Style {
    constructor(config = {}) {
        this.targets = new Set();
        this.props = new Map();
        Object.entries(config).forEach(([key, value]) => {
            if (value !== undefined)
                this[key]?.(value);
        });
    }
    bind(target) {
        this.targets.add(target);
        this.props.forEach((v, k) => target.style.setProperty(k, v));
        return this;
    }
    value(prop) {
        return this.props.get(prop);
    }
    remove(prop) {
        this.props.delete(prop);
        this.targets.forEach((target) => target.style.removeProperty(prop));
        return this;
    }
    raw(prop, value) {
        this.props.set(prop, value);
        this.targets.forEach((t) => t.style.setProperty(prop, value));
        return this;
    }
    width(v) {
        return this.raw("width", dimension(v, "Width"));
    }
    maxWidth(v) {
        return this.raw("max-width", dimension(v, "Max width"));
    }
    height(v) {
        return this.raw("height", dimension(v, "Height"));
    }
    minWidth(v) {
        return this.raw("min-width", dimension(v, "Min width"));
    }
    minHeight(v) {
        return this.raw("min-height", dimension(v, "Min height"));
    }
    spacing(v, allowNegative = false) {
        if (typeof v === "number")
            return pixels(v, "Spacing", allowNegative);
        if (typeof v === "string")
            return v;
        return v.map((value) => pixels(value, "Spacing", allowNegative)).join(" ");
    }
    pad(v, h) {
        return this.raw("padding", h === undefined ? this.spacing(v) : `${this.spacing(v)} ${pixels(h, "Padding")}`);
    }
    margin(v, h) {
        return this.raw("margin", h === undefined ? this.spacing(v, true) : `${this.spacing(v, true)} ${pixels(h, "Margin", true)}`);
    }
    padding(v) {
        return this.raw("padding", this.spacing(v));
    }
    gap(v) {
        return this.raw("gap", pixels(v, "Gap"));
    }
    background(v) {
        return this.raw("background-color", v);
    }
    color(v) {
        return this.raw("color", v);
    }
    radius(v) {
        return this.raw("border-radius", pixels(v, "Radius"));
    }
    shadow(v) {
        return this.raw("box-shadow", shadows[v]);
    }
    opacity(v) {
        return this.raw("opacity", opacityValue(v));
    }
    cursor(v) {
        return this.raw("cursor", v);
    }
    border(width, color) {
        return this.raw("border", `${pixels(width, "Border width")} solid ${color}`);
    }
    font(size, weight, family) {
        if (weight !== undefined)
            this.raw("font-weight", String(weight));
        if (family)
            this.raw("font-family", family);
        return this.raw("font-size", fontSize(size));
    }
    weight(value) {
        return this.raw("font-weight", String(value));
    }
    row(align = "start") {
        return this.raw("display", "grid")
            .raw("grid-auto-flow", "column")
            .raw("justify-content", justify[align]);
    }
    column(align = "start") {
        return this.raw("display", "grid")
            .raw("grid-auto-flow", "row")
            .raw("justify-content", justify[align]);
    }
    center() {
        return this.raw("display", "grid").raw("place-items", "center");
    }
    fill() {
        return this.width("100%").height("100%");
    }
    transition(ms, easing = "ease") {
        return this.raw("transition", `all ${ms}ms ${easing}`);
    }
    when(condition, apply) {
        const base = new Map(this.props);
        condition.subscribe((active) => {
            if (active) {
                if (typeof apply === "function")
                    apply(this);
                else
                    Object.entries(apply).forEach(([key, value]) => {
                        if (value !== undefined)
                            this[key]?.(value);
                    });
                return;
            }
            const activeKeys = new Set(this.props.keys());
            this.props = new Map(base);
            this.targets.forEach((target) => {
                activeKeys.forEach((key) => {
                    if (!this.props.has(key))
                        target.style.removeProperty(key);
                    else
                        target.style.setProperty(key, this.props.get(key));
                });
            });
        });
        return this;
    }
}
