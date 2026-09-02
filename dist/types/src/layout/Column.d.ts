import { Container, type ContainerOptions } from "../elements/Container.js";
export interface ColumnOptions extends ContainerOptions {
}
export type Column = ReturnType<typeof Container>;
/** Convenience wrapper for the default vertical Container. */
export declare const Column: (options?: ColumnOptions) => import("../elements/Container.js").ContainerElement;
//# sourceMappingURL=Column.d.ts.map