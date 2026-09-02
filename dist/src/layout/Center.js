import { Container } from "../elements/Container.js";
/** A single-child wrapper that centers its child without changing its layout. */
export const Center = function (options) {
    return Container({
        ...options,
        center: true,
        children: [options.child],
    });
};
