import { Container, type ContainerOptions } from "../elements/Container.js";
import type { Element } from "../core/Element.js";

export interface CenterOptions extends Omit<ContainerOptions, "children" | "row" | "center"> {
  child: Element;
}
export type Center = ReturnType<typeof Container>;

/** A single-child wrapper that centers its child without changing its layout. */
export const Center = function(options: CenterOptions) {
  return Container({
    ...options,
    center: true,
    children: [options.child],
  });
};