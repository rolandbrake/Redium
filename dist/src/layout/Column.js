import { Container } from "../elements/Container.js";
/** Convenience wrapper for the default vertical Container. */
export const Column = function (options = {}) {
    return Container({ ...options, row: false, wrap: options.wrap ?? false });
};
