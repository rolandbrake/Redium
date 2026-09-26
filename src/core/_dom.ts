import type { Element } from "./Element.js";
const nodes = new WeakMap<Element, HTMLElement>();
export function createDOM(element: Element, tag: string): HTMLElement {
  const node = document.createElement(tag);
  nodes.set(element, node);
  return node;
}
export function domOf(element: Element): HTMLElement {
  return nodes.get(element)!;
}
