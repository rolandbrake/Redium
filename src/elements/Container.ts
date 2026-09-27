import { styles } from "../style/Style.js";
import { Element, type ElementOptions } from "../core/Element.js";
import type { Node } from "../core/Node.js";
import {
  dimension,
  type AbsoluteValue,
  type SizeValue,
} from "../style/Size.js";
import type { SpacingValue } from "../style/Style.js";

export interface ContainerOptions extends ElementOptions {
  children?: Element[];
  width?: SizeValue;
  height?: SizeValue;
  minWidth?: SizeValue;
  maxWidth?: SizeValue;
  minHeight?: SizeValue;
  maxHeight?: SizeValue;
  /** Flex shrink ratio. Defaults to 1. */
  shrink?: number;
  /** Flex grow ratio. Defaults to 0. */
  grow?: number;
  padding?: SpacingValue;
  margin?: SpacingValue;
  gap?: AbsoluteValue;
  row?: boolean;
  /** Container and Row default to wrapping; Column disables it for vertical stacks. */
  wrap?: boolean;

  // Centering is a special case that overrides the default alignment of children.
  // It is not a general-purpose layout option, but it is useful for certain common cases.
  center?: boolean;
}

/** Flex container by default: vertical unless row: true is specified. */
export class ContainerElement extends Element {
  protected readonly canContainChildren = true;
  private readonly rowLayout: boolean;
  private readonly wrapLayout: boolean;
  private readonly centerLayout: boolean;

  constructor(options: ContainerOptions = {}) {
    super("div", options, "container");
    this.rowLayout = options.row === true;
    this.wrapLayout = options.wrap ?? true;
    this.centerLayout = options.center === true;
    this.validateRatio("shrink", options.shrink ?? 1);
    this.validateRatio("grow", options.grow ?? 0);
    this.addBaseClasses(
      this.rowLayout ? "r-row" : "r-column",
      this.wrapLayout ? "r-wrap" : "r-nowrap",
      ...(this.centerLayout ? ["r-center"] : []),
    );
    if (options.shrink !== undefined) styles(this.style).raw("flex-shrink", String(options.shrink));
    if (options.grow !== undefined) styles(this.style).raw("flex-grow", String(options.grow));
    this.applySize("width", options.width);
    this.applySize("height", options.height);
    this.applySize("min-width", options.minWidth);
    this.applySize("max-width", options.maxWidth);
    this.applySize("min-height", options.minHeight);
    this.applySize("max-height", options.maxHeight);
    if (options.gap !== undefined) this.style.gap(options.gap);
    if (options.padding !== undefined) this.style.pad(options.padding);
    if (options.margin !== undefined) this.style.margin(options.margin);
    if (options.children) this.add(...options.children);
  }

  private validateRatio(name: string, value: number): void {
    if (!Number.isFinite(value) || value < 0 || value > 1)
      throw new Error(`${name} must be between 0 and 1.`);
  }

  private applySize(property: string, value?: SizeValue): void {
    if (value !== undefined)
      styles(this.style).raw(property, this.sizeValue(value, property));
  }

  private sizeValue(value: SizeValue, property = "Dimension"): string {
    return dimension(value, property);
  }

  protected override onChildAdded(node: Node): void {
    super.onChildAdded(node);
    if (!(node instanceof Element)) return;
    const isContainer = node instanceof ContainerElement;
    if (this.rowLayout && isContainer && styles(node.style).value("width") === undefined)
      styles(node.style).raw("width", "auto");
    if (this.centerLayout)
      styles(node.style)
        .default("align-self", "center")
        .default("justify-self", "center");
    else if (isContainer)
      styles(node.style)
        .default("align-self", "stretch")
        .default("justify-self", "stretch");
    else if (this.rowLayout) {
      if (styles(node.style).value("width") !== undefined)
        styles(node.style).raw("flex-shrink", "0");
      styles(node.style).default("align-self", "flex-start");
    } else
      styles(node.style)
        .default("align-self", "flex-start")
        .default("justify-self", "flex-start");
  }

}

export type Container = ContainerElement;
export interface ContainerFactory {
  (options?: ContainerOptions): ContainerElement;
  new (options?: ContainerOptions): ContainerElement;
}
export const Container = function (options: ContainerOptions = {}) {
  return new ContainerElement(options);
} as ContainerFactory;
