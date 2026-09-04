import { ContainerElement, type ContainerOptions } from "../elements/Container.js";
import { pixels, type CSSFunction } from "../style/Size.js";

export interface GridOptions extends ContainerOptions {
  columns?: number;
  rows?: number;
  gap?: number;
  minColumnWidth?: number | CSSFunction;
}

/** A responsive two-dimensional layout primitive. */
export class GridElement extends ContainerElement {
  constructor(options: GridOptions = {}) {
    super(options);
    this.style
      .default("display", "grid")
      .default("align-items", "stretch")
      .default("justify-items", "stretch");
    this.setColumns(options.columns ?? 1, options.wrap !== false, options.minColumnWidth);
    this.setRows(options.rows);
    // Container does not create a gap unless one was requested. Avoid
    // writing gap: 0 here so a style supplied by the caller is preserved.
    if (options.gap !== undefined) this.style.gap(options.gap);
  }

  private setColumns(columns: number, wrap: boolean, minColumnWidth?: number | CSSFunction): void {
    if (!Number.isInteger(columns) || columns < 1) throw new Error("Grid columns must be a positive integer.");
    if (wrap && minColumnWidth !== undefined) {
      const minimum = typeof minColumnWidth === "number" ? pixels(minColumnWidth, "Minimum column width") : minColumnWidth;
      this.style.default("grid-template-columns", `repeat(auto-fit, minmax(min(100%, ${minimum}), 1fr))`);
    } else {
      this.style.default("grid-template-columns", `repeat(${columns}, minmax(0, 1fr))`);
    }
  }

  private setRows(rows?: number): void {
    if (rows !== undefined) {
      if (!Number.isInteger(rows) || rows < 1) throw new Error("Grid rows must be a positive integer.");
      this.style.default("grid-template-rows", `repeat(${rows}, auto)`);
    } else {
      this.style.default("grid-auto-rows", "minmax(min-content, max-content)");
    }
  }
}

export type Grid = GridElement;
export interface GridFactory { (options?: GridOptions): GridElement; new (options?: GridOptions): GridElement; }
export const Grid = function(options: GridOptions = {}) { return new GridElement(options); } as GridFactory;
