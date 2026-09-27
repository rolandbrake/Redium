import { Container, type ContainerOptions } from "../elements/Container.js";
import type { Element } from "../core/Element.js";
import { ratio } from "../style/Size.js";
import { styles } from "../style/Style.js";

export type CenterOptions = Omit<ContainerOptions, "children" | "row" | "center">;
export type Center = ReturnType<typeof Container>;

/** A single-child wrapper that fills its parent and centers its child. */
export const Center = function(child: Element, options: CenterOptions = {}) {
  // Container-based elements fill their parent by default. A full-width child
  // has no horizontal room for grid centering to be visible, so a Center child
  // uses its intrinsic width unless the caller explicitly supplied one.
  // Todo: check this part in the future
  styles(child.style).default("width", "fit-content");
  return Container({
    ...options,
    width: options.width ?? ratio(1),
    height: options.height ?? ratio(1),
    center: true,
    children: [child],
  });
};
