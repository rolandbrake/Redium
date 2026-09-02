import { Container } from "../elements/Container.js";
/** Convenience wrapper for Container({ row: true }). */
export const Row = function (options = {}) {
    return Container({ ...options, row: true, wrap: options.wrap ?? false });
};
