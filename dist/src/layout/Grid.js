import { ContainerElement } from "../elements/Container.js";
/** A responsive two-dimensional layout primitive. */
export class GridElement extends ContainerElement {
    constructor(options = {}) {
        super(options);
        this.style
            .raw("display", "grid")
            .raw("align-items", "stretch")
            .raw("justify-items", "stretch");
        this.setColumns(options.columns ?? 1, options.wrap !== false, options.minColumnWidth);
        this.setRows(options.rows);
        this.style.gap(options.gap ?? 0);
    }
    setColumns(columns, wrap, minColumnWidth) {
        if (!Number.isInteger(columns) || columns < 1)
            throw new Error("Grid columns must be a positive integer.");
        if (wrap && minColumnWidth !== undefined) {
            const minimum = typeof minColumnWidth === "number" ? `${minColumnWidth}px` : minColumnWidth;
            this.style.raw("grid-template-columns", `repeat(auto-fit, minmax(min(100%, ${minimum}), 1fr))`);
        }
        else {
            this.style.raw("grid-template-columns", `repeat(${columns}, minmax(0, 1fr))`);
        }
    }
    setRows(rows) {
        if (rows !== undefined) {
            if (!Number.isInteger(rows) || rows < 1)
                throw new Error("Grid rows must be a positive integer.");
            this.style.raw("grid-template-rows", `repeat(${rows}, auto)`);
        }
        else {
            this.style.raw("grid-auto-rows", "minmax(min-content, max-content)");
        }
    }
}
export const Grid = function (options = {}) { return new GridElement(options); };
