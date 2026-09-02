function finite(value, name) {
    if (!Number.isFinite(value))
        throw new Error(`${name} must be a finite number.`);
    return value;
}
export function px(value) {
    return `${finite(value, "Pixel value")}px`;
}
export function ratio(value) {
    finite(value, "Relative value");
    if (value < 0 || value > 1)
        throw new Error("Relative value must be between 0 and 1.");
    return `${value * 100}%`;
}
/** Converts a dimension number: 0..1 is relative, values above 1 are pixels. */
export function dimension(value, property = "Dimension") {
    if (typeof value !== "number")
        return value;
    finite(value, property);
    if (value < 0)
        throw new Error(`${property} cannot be negative.`);
    return value <= 1 ? ratio(value) : px(value);
}
/** Converts a value whose unit is always logical CSS pixels. */
export function pixels(value, property = "Pixel value", allowNegative = false) {
    finite(value, property);
    if (!allowNegative && value < 0)
        throw new Error(`${property} cannot be negative.`);
    return px(value);
}
/** Converts the framework's absolute font size to rem using the 16px root. */
export function fontSize(value) {
    finite(value, "Font size");
    if (value < 0)
        throw new Error("Font size cannot be negative.");
    return `${value / 16}rem`;
}
export function opacity(value) {
    finite(value, "Opacity");
    if (value < 0 || value > 1)
        throw new Error("Opacity must be between 0 and 1.");
    return String(value);
}
function valueOf(value) {
    return typeof value === "number" ? dimension(value) : value;
}
export function min(...values) {
    return `min(${values.map(valueOf).join(", ")})`;
}
export function max(...values) {
    return `max(${values.map(valueOf).join(", ")})`;
}
export function clamp(minimum, preferred, maximum) {
    return `clamp(${valueOf(minimum)}, ${valueOf(preferred)}, ${valueOf(maximum)})`;
}
