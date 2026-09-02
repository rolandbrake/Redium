import { Container, type ContainerOptions } from "../elements/Container.js";

export interface ColumnOptions extends ContainerOptions {}
export type Column = ReturnType<typeof Container>;

/** Convenience wrapper for the default vertical Container. */
export const Column = function(options: ColumnOptions = {}) {
  return Container({ ...options, row: false, wrap: options.wrap ?? false });
};