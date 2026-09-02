import type { Element } from "../core/Element.js";
export type View = Element | (() => Element);
/** Creates a view and mounts it when a browser host is available. */
export declare function mountElement(view: View, target?: HTMLElement): Element;
//# sourceMappingURL=render.d.ts.map