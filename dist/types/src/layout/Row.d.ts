import { Container, type ContainerOptions } from "../elements/Container.js";
export interface RowOptions extends ContainerOptions {
}
export type Row = ReturnType<typeof Container>;
/** Convenience wrapper for Container({ row: true }). */
export declare const Row: (options?: RowOptions) => import("../elements/Container.js").ContainerElement;
//# sourceMappingURL=Row.d.ts.map