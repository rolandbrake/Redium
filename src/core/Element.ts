import { Node, type EventHandler } from "./Node.js";
import { State } from "../state/State.js";
import { Style, type StyleConfig } from "../style/Style.js";

export interface ElementOptions {
  style?: Style | StyleConfig;
  id?: string;
  className?: string;
}

/** A Node with one DOM projection and semantic interaction APIs. */
export abstract class Element extends Node {
  readonly dom: HTMLElement;
  readonly style: Style;
  private _hovering?: State<boolean>;
  private _focused?: State<boolean>;
  private _pressed?: State<boolean>;
  private _clicked?: State<number>;
  protected readonly canContainChildren: boolean = false;

  protected constructor(tag: string, options: ElementOptions = {}) {
    super();
    this.dom = document.createElement(tag);
    this.style = (
      options.style instanceof Style ? options.style : new Style(options.style)
    ).bind(this.dom);
    this.style.default("box-sizing", "border-box").default("min-width", "0");
    if (options.id) this.dom.id = options.id;
    if (options.className) this.dom.className = options.className;
  }
  override add(...nodes: Node[]): this {
    if (!this.canContainChildren && nodes.length)
      throw new Error(`${this.constructor.name} cannot contain children.`);
    return super.add(...nodes);
  }
  override addFirst(...nodes: Node[]): this {
    if (!this.canContainChildren && nodes.length)
      throw new Error(`${this.constructor.name} cannot contain children.`);
    return super.addFirst(...nodes);
  }
  protected onChildAdded(node: Node): void {
    if (node instanceof Element) this.dom.appendChild(node.dom);
  }
  protected onChildRemoved(node: Node): void {
    if (node instanceof Element && node.dom.parentElement === this.dom)
      this.dom.removeChild(node.dom);
  }
  override on<T = unknown>(event: string, handler: EventHandler<T>): this {
    super.on(event, handler);
    this.dom.addEventListener(event, handler as EventListener);
    return this;
  }
  override off<T = unknown>(event: string, handler: EventHandler<T>): this {
    super.off(event, handler);
    this.dom.removeEventListener(event, handler as EventListener);
    return this;
  }
  attr(name: string, value?: string): this | string | null {
    if (value === undefined) return this.dom.getAttribute(name);
    this.dom.setAttribute(name, value);
    return this;
  }
  show(): this {
    this.style.raw("display", "");
    return this;
  }
  hide(): this {
    this.style.raw("display", "none");
    return this;
  }

  get hovering(): State<boolean> {
    if (!this._hovering) {
      const s = new State(false);
      this.dom.addEventListener("mouseenter", () => (s.value = true));
      this.dom.addEventListener("mouseleave", () => (s.value = false));
      this._hovering = s;
    }
    return this._hovering;
  }
  get focused(): State<boolean> {
    if (!this._focused) {
      const s = new State(false);
      this.dom.addEventListener("focusin", () => (s.value = true));
      this.dom.addEventListener("focusout", () => (s.value = false));
      this._focused = s;
    }
    return this._focused;
  }
  get pressed(): State<boolean> {
    if (!this._pressed) {
      const s = new State(false);
      this.dom.addEventListener("mousedown", () => (s.value = true));
      this.dom.addEventListener("mouseup", () => (s.value = false));
      this.dom.addEventListener("mouseleave", () => (s.value = false));
      this._pressed = s;
    }
    return this._pressed;
  }
  get clicked(): State<number> {
    if (!this._clicked) {
      const s = new State(0);
      this.dom.addEventListener("click", () => s.value++);
      this._clicked = s;
    }
    return this._clicked;
  }
  onClick(fn: (event: Event) => void): this {
    return this.on("click", fn);
  }
  onHover(fn: (value: boolean) => void): this {
    this.hovering.subscribe(fn);
    return this;
  }
  onFocus(fn: (value: boolean) => void): this {
    this.focused.subscribe(fn);
    return this;
  }
  onPress(fn: (value: boolean) => void): this {
    this.pressed.subscribe(fn);
    return this;
  }
  mount(target: HTMLElement = document.body): this {
    target.appendChild(this.dom);
    return this;
  }
  unmount(): this {
    this.dom.parentElement?.removeChild(this.dom);
    return this;
  }
}
