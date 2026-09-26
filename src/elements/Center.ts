import { Container, type ContainerOptions } from "../elements/Container.js";
import type { Element } from "../core/Element.js";
import { ratio } from "../style/Size.js";

export type CenterOptions = Omit<ContainerOptions, "children" | "row" | "center">;
export type Center = ReturnType<typeof Container>;

/** A single-child wrapper that fills its parent and centers its child. */
export const Center = function(child: Element, options: CenterOptions = {}) {
  return Container({
    ...options,
    width: options.width ?? ratio(1),
    height: options.height ?? ratio(1),
    center: true,
    children: [child],
  });
};
