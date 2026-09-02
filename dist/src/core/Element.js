import { Node } from "./Node.js";
import { State } from "../state/State.js";
import { Style } from "../style/Style.js";
/** A Node with one DOM projection and semantic interaction APIs. */
export class Element extends Node {
    constructor(tag, options = {}) {
        super();
        this.canContainChildren = false;
        this.dom = document.createElement(tag);
        this.style = (options.style instanceof Style ? options.style : new Style(options.style)).bind(this.dom);
        this.style.raw("box-sizing", "border-box").raw("min-width", "0");
        if (options.id)
            this.dom.id = options.id;
        if (options.className)
            this.dom.className = options.className;
    }
    add(...nodes) {
        if (!this.canContainChildren && nodes.length)
            throw new Error(`${this.constructor.name} cannot contain children.`);
        return super.add(...nodes);
    }
    addFirst(...nodes) {
        if (!this.canContainChildren && nodes.length)
            throw new Error(`${this.constructor.name} cannot contain children.`);
        return super.addFirst(...nodes);
    }
    onChildAdded(node) {
        if (node instanceof Element)
            this.dom.appendChild(node.dom);
    }
    onChildRemoved(node) {
        if (node instanceof Element && node.dom.parentElement === this.dom)
            this.dom.removeChild(node.dom);
    }
    on(event, handler) {
        super.on(event, handler);
        this.dom.addEventListener(event, handler);
        return this;
    }
    off(event, handler) {
        super.off(event, handler);
        this.dom.removeEventListener(event, handler);
        return this;
    }
    attr(name, value) {
        if (value === undefined)
            return this.dom.getAttribute(name);
        this.dom.setAttribute(name, value);
        return this;
    }
    show() {
        this.style.raw("display", "");
        return this;
    }
    hide() {
        this.style.raw("display", "none");
        return this;
    }
    get hovering() {
        if (!this._hovering) {
            const s = new State(false);
            this.dom.addEventListener("mouseenter", () => (s.value = true));
            this.dom.addEventListener("mouseleave", () => (s.value = false));
            this._hovering = s;
        }
        return this._hovering;
    }
    get focused() {
        if (!this._focused) {
            const s = new State(false);
            this.dom.addEventListener("focusin", () => (s.value = true));
            this.dom.addEventListener("focusout", () => (s.value = false));
            this._focused = s;
        }
        return this._focused;
    }
    get pressed() {
        if (!this._pressed) {
            const s = new State(false);
            this.dom.addEventListener("mousedown", () => (s.value = true));
            this.dom.addEventListener("mouseup", () => (s.value = false));
            this.dom.addEventListener("mouseleave", () => (s.value = false));
            this._pressed = s;
        }
        return this._pressed;
    }
    get clicked() {
        if (!this._clicked) {
            const s = new State(0);
            this.dom.addEventListener("click", () => s.value++);
            this._clicked = s;
        }
        return this._clicked;
    }
    onClick(fn) {
        return this.on("click", fn);
    }
    onHover(fn) {
        this.hovering.subscribe(fn);
        return this;
    }
    onFocus(fn) {
        this.focused.subscribe(fn);
        return this;
    }
    onPress(fn) {
        this.pressed.subscribe(fn);
        return this;
    }
    mount(target = document.body) {
        target.appendChild(this.dom);
        return this;
    }
    unmount() {
        this.dom.parentElement?.removeChild(this.dom);
        return this;
    }
}
