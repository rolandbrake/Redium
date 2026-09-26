import type { Element } from "./Element.js";

let nextElementId = 0;
const elementIds = new WeakMap<Element, string>();

/** @internal Assign a private runtime identity to a newly created element. */
export function assignElementId(element: Element): void {
  elementIds.set(element, `r${++nextElementId}`);
}

/** @internal Read an element's private runtime identity for framework maps. */
export function elementId(element: Element): string {
  return elementIds.get(element)!;
}
