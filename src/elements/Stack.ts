import { Element } from "../core/Element.js";
import type { Node } from "../core/Node.js";
import { styles } from "../style/Style.js";
import { ContainerElement, type ContainerOptions } from "./Container.js";

export interface StackOptions extends Omit<ContainerOptions, "row" | "wrap"> {}

/** A layered container. Later children appear above earlier children. */
export class StackElement extends ContainerElement {
  constructor(options: StackOptions = {}) {
    super({ ...options, row: false, wrap: false });
    this.setElementKind("stack");
    this.refreshLayers();
  }

  /** Add one or more layers above the current top layer. */
  push(...elements: Element[]): this {
    return this.add(...elements);
  }

  /** Return the current top layer without changing the stack. */
  peek(): Element | undefined {
    return [...this.children]
      .reverse()
      .find((child): child is Element => child instanceof Element);
  }

  /** Remove and permanently dispose the current top layer. */
  pop(): Element | undefined {
    const element = this.peek();
    element?.dispose();
    return element;
  }

  /** Permanently dispose every layer. */
  clear(): this {
    for (const child of [...this.children].reverse()) {
      if (child instanceof Element) child.dispose();
      else this.remove(child);
    }
    return this;
  }

  protected override onChildAdded(node: Node): void {
    super.onChildAdded(node);
    if (node instanceof Element) {
      styles(node.style).default("grid-area", "1 / 1");
      this.refreshLayers();
    }
  }

  protected override onChildRemoved(node: Node): void {
    super.onChildRemoved(node);
    if (node instanceof Element) this.refreshLayers();
  }

  private refreshLayers(): void {
    let layer = 0;
    for (const child of this.children)
      if (child instanceof Element)
        styles(child.style).default("z-index", String(layer++));
  }
}

export type Stack = StackElement;
export interface StackFactory {
  (options?: StackOptions): StackElement;
  new (options?: StackOptions): StackElement;
}
export const Stack = function (options: StackOptions = {}) {
  return new StackElement(options);
} as StackFactory;
