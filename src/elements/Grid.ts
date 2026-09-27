import { styles } from "../style/Style.js";
import { ContainerElement, type ContainerOptions } from "../elements/Container.js";
import { dimension, type AbsoluteValue, type SizeValue } from "../style/Size.js";

export interface GridOptions extends Omit<ContainerOptions, "row" | "center"> {
  columns?: number;
  rows?: number;
  gap?: AbsoluteValue;
  minColumnWidth?: SizeValue;
}

/** A responsive two-dimensional layout primitive. */
export class GridElement extends ContainerElement {
  constructor(options: GridOptions = {}) {
    super(options);
    this.setElementKind("grid");
    this.setColumns(options.columns ?? 1, options.wrap !== false, options.minColumnWidth);
    this.setRows(options.rows);
    // Container does not create a gap unless one was requested. Avoid
    // writing gap: 0 here so a style supplied by the caller is preserved.
    if (options.gap !== undefined) this.style.gap(options.gap);
  }

  private setColumns(columns: number, wrap: boolean, minColumnWidth?: SizeValue): void {
    if (!Number.isInteger(columns) || columns < 1) throw new Error("Grid columns must be a positive integer.");
    if (wrap && minColumnWidth !== undefined) {
      const minimum = dimension(minColumnWidth, "Minimum column width");
      styles(this.style).raw("grid-template-columns", `repeat(auto-fit, minmax(min(100%, ${minimum}), 1fr))`);
    } else {
      if (columns === 1 && minColumnWidth === undefined) this.addBaseClasses("r-grid-one");
      else styles(this.style).raw("grid-template-columns", `repeat(${columns}, minmax(0, 1fr))`);
    }
  }

  private setRows(rows?: number): void {
    if (rows !== undefined) {
      if (!Number.isInteger(rows) || rows < 1) throw new Error("Grid rows must be a positive integer.");
      styles(this.style).raw("grid-template-rows", `repeat(${rows}, auto)`);
    } else {
      this.addBaseClasses("r-grid-auto-rows");
    }
  }
}

export type Grid = GridElement;
export interface GridFactory { (options?: GridOptions): GridElement; new (options?: GridOptions): GridElement; }
export const Grid = function(options: GridOptions = {}) { return new GridElement(options); } as GridFactory;
