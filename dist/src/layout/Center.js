import { Container } from "../elements/Container.js";
/** A single-child wrapper that fills its parent and centers its child. */
export const Center = function (child, options = {}) {
    return Container({
        ...options,
        width: options.width ?? 1,
        height: options.height ?? 1,
        center: true,
        children: [child],
    });
};
