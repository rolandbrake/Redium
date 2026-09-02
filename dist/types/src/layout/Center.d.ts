import { Container, type ContainerOptions } from "../elements/Container.js";
import type { Element } from "../core/Element.js";
export type CenterOptions = Omit<ContainerOptions, "children" | "row" | "center">;
export type Center = ReturnType<typeof Container>;
/** A single-child wrapper that fills its parent and centers its child. */
export declare const Center: (child: Element, options?: CenterOptions) => import("../elements/Container.js").ContainerElement;
//# sourceMappingURL=Center.d.ts.map