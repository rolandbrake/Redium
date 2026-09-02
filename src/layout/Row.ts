import { Container, type ContainerOptions } from "../elements/Container.js";

export interface RowOptions extends ContainerOptions {}
export type Row = ReturnType<typeof Container>;

/** Convenience wrapper for Container({ row: true }). */
export const Row = function(options: RowOptions = {}) {
  return Container({ ...options, row: true, wrap: options.wrap ?? false });
};