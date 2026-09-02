import { ContainerElement, type ContainerOptions } from "../elements/Container.js";
import { type CSSFunction } from "../style/Size.js";
export interface GridOptions extends ContainerOptions {
    columns?: number;
    rows?: number;
    gap?: number;
    minColumnWidth?: number | CSSFunction;
}
/** A responsive two-dimensional layout primitive. */
export declare class GridElement extends ContainerElement {
    constructor(options?: GridOptions);
    private setColumns;
    private setRows;
}
export type Grid = GridElement;
export interface GridFactory {
    (options?: GridOptions): GridElement;
    new (options?: GridOptions): GridElement;
}
export declare const Grid: GridFactory;
//# sourceMappingURL=Grid.d.ts.map