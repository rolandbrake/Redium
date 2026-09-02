import type { Element } from "../core/Element.js";

export type View = Element | (() => Element);

/** Creates a view and mounts it when a browser host is available. */
export function mountElement(view: View, target?: HTMLElement): Element {
  const element = typeof view === "function" ? view() : view;
  if (typeof document !== "undefined") element.mount(target ?? document.body);
  return element;
}