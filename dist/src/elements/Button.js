import { Element } from "../core/Element.js";
import { State } from "../state/State.js";
export class ButtonElement extends Element {
    constructor(textOrOptions, options = {}) {
        const opts = typeof textOrOptions === "string" || State.isState(textOrOptions)
            ? { ...options, text: textOrOptions }
            : (textOrOptions ?? {});
        super("button", opts);
        this.style
            .raw("min-width", "5rem")
            .raw("min-height", "2.75rem")
            .raw("padding", "0.625rem 1rem")
            .raw("font-size", "1rem")
            .raw("line-height", "1.2")
            .raw("touch-action", "manipulation");
        if (opts.text !== undefined)
            this.setText(opts.text);
        if (opts.onClick)
            this.onClick(opts.onClick.bind(this));
        if (State.isState(opts.disabled))
            opts.disabled.subscribe((value) => (this.disabled = Boolean(value)));
        else if (typeof opts.disabled === "boolean")
            this.disabled = opts.disabled;
    }
    setText(value) {
        if (State.isState(value))
            value.subscribe((next) => (this.text = next));
        else
            this.text = value;
    }
    get text() {
        return this.dom.textContent ?? "";
    }
    set text(value) {
        this.dom.textContent = value;
    }
    get disabled() {
        return this.dom.disabled;
    }
    set disabled(value) {
        this.dom.disabled = value;
        this.attr("aria-disabled", String(value));
    }
}
export const Button = function (textOrOptions, options = {}) {
    return new ButtonElement(textOrOptions, options);
};
