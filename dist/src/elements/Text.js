import { Element } from "../core/Element.js";
import { State } from "../state/State.js";
export class TextElement extends Element {
    constructor(content, options = {}) {
        super("span", options);
        if (State.isState(content))
            content.subscribe((value) => (this.text = String(value)));
        else
            this.text = String(content);
    }
    get text() {
        return this.dom.textContent ?? "";
    }
    set text(value) {
        this.dom.textContent = value;
    }
}
export const Text = function (content, options = {}) {
    return new TextElement(content, options);
};
