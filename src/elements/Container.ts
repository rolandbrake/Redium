import { Element, type ElementOptions } from "../core/Element.js";
import type { Node } from "../core/Node.js";
import { dimension, type SizeValue } from "../style/Size.js";
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
  fit?: number;
  /** Flex grow ratio. Defaults to 0. */
  fill?: number;
  padding?: SpacingValue;
  margin?: SpacingValue;
  gap?: number;
  row?: boolean;
  /** Container defaults to true; Row and Column wrappers default to false. */
  wrap?: boolean;
  center?: boolean;
}

/** Flex container by default: vertical unless row: true is specified. */
export class ContainerElement extends Element {
  protected readonly canContainChildren = true;
  private readonly originalWidths = new Map<Element, string | undefined>();
  private readonly rowLayout: boolean;
  private readonly wrapLayout: boolean;
  private readonly centerLayout: boolean;
  private observer?: ResizeObserver;
  private childrenAreWrapped = false;

  constructor(options: ContainerOptions = {}) {
    super("div", options);
    this.rowLayout = options.row === true;
    this.wrapLayout = options.wrap ?? true;
    this.centerLayout = options.center === true;
    this.validateRatio("fit", options.fit ?? 1);
    this.validateRatio("fill", options.fill ?? 0);
    this.style
      .default("display", "flex")
      .default("flex-direction", this.rowLayout ? "row" : "column")
      .default("flex-wrap", this.wrapLayout ? "wrap" : "nowrap")
      .default("flex-shrink", String(options.fit ?? 1))
      .default("flex-grow", String(options.fill ?? 0))
      .default("align-items", "stretch")
      .default("align-content", "stretch");
    if (this.centerLayout)
      this.style.raw("justify-content", "center").raw("align-items", "center");

    if (this.style.value("width") === undefined)
      this.style.width(1);
    this.applySize("width", options.width);
    this.applySize("height", options.height);
    this.applySize("min-width", options.minWidth);
    this.applySize("max-width", options.maxWidth);
    this.applySize("min-height", options.minHeight);
    this.applySize("max-height", options.maxHeight);
    if (options.maxWidth === undefined && this.style.value("max-width") === undefined)
      this.style.maxWidth(1);
    this.style.raw("box-sizing", "border-box");
    if (options.gap !== undefined) this.style.gap(options.gap);
    if (options.padding !== undefined) this.style.pad(options.padding);
    if (options.margin !== undefined) this.style.margin(options.margin);
    if (options.children) this.add(...options.children);
    if (this.rowLayout) this.watchRowLayout();
  }

  private validateRatio(name: string, value: number): void {
    if (!Number.isFinite(value) || value < 0 || value > 1)
      throw new Error(`${name} must be between 0 and 1.`);
  }

  private applySize(property: string, value?: SizeValue): void {
    if (value !== undefined)
      this.style.raw(property, this.sizeValue(value, property));
  }

  private sizeValue(value: SizeValue, property = "Dimension"): string {
    return dimension(value, property);
  }

  /** Recalculate relative row widths after accounting for gaps and margins. */
  private watchRowLayout(): void {
    if (typeof ResizeObserver === "undefined") return;
    this.observer = new ResizeObserver(() => this.updateRowChildren());
    this.observer.observe(this.dom);
    queueMicrotask(() => this.updateRowChildren());
  }

  private updateRowChildren(): void {
    const children = this.children.filter(
      (child): child is Element => child instanceof Element,
    );
    children.forEach((child) => {
      if (!this.originalWidths.has(child))
        this.originalWidths.set(child, child.style.value("width"));
    });
    if (children.length < 2 || this.dom.clientWidth === 0) return;
    children.forEach((child) => {
      const width = this.originalWidths.get(child);
      if (width === undefined) child.style.remove("width");
      else child.style.raw("width", width);
    });
    this.applyRelativeWidths(children);
    if (!this.wrapLayout) return;
    const firstTop = children[0].dom.getBoundingClientRect().top;
    const wrapped = children.some(
      (child) => Math.abs(child.dom.getBoundingClientRect().top - firstTop) > 1,
    );
    this.childrenAreWrapped = wrapped;
    if (wrapped)
      children.forEach((child) => {
        const style = getComputedStyle(child.dom);
        const margin =
          this.number(style.marginLeft) + this.number(style.marginRight);
        child.style.raw(
          "width",
          margin > 0 ? `calc(100% - ${margin}px)` : "100%",
        );
      });
  }

  private applyRelativeWidths(children: Element[]): void {
    const ratios = children.map((child) => {
      const value = this.originalWidths.get(child);
      const match = value?.match(/^([0-9]*\.?[0-9]+)%$/);
      return match ? Number(match[1]) / 100 : undefined;
    });
    if (ratios.some((ratio) => ratio === undefined)) return;
    const containerStyle = getComputedStyle(this.dom);
    const padding =
      this.number(containerStyle.paddingLeft) +
      this.number(containerStyle.paddingRight);
    const gapValue =
      containerStyle.columnGap !== "normal"
        ? containerStyle.columnGap
        : containerStyle.gap;
    const gap = this.number(gapValue);
    const margins = children.reduce<number>((total, child) => {
      const style = getComputedStyle(child.dom);
      return (
        total + this.number(style.marginLeft) + this.number(style.marginRight)
      );
    }, 0);
    const available = Math.max(
      0,
      this.dom.clientWidth - padding - gap * (children.length - 1) - margins,
    );
    const totalRatio = ratios.reduce<number>(
      (total, ratio) => total + (ratio ?? 0),
      0,
    );
    if (available <= 0 || totalRatio <= 0 || totalRatio > 1) return;
    children.forEach((child, index) =>
      child.style.raw("width", `${available * (ratios[index] ?? 0)}px`),
    );
  }

  private number(value: string): number {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  protected override onChildAdded(node: Node): void {
    super.onChildAdded(node);
    if (!(node instanceof Element)) return;
    const isContainer = node instanceof ContainerElement;
    if (this.rowLayout && isContainer && node.style.value("width") === "100%")
      node.style.remove("width");
    if (this.centerLayout)
      node.style.raw("align-self", "center").raw("justify-self", "center");
    else if (isContainer)
      node.style.raw("align-self", "stretch").raw("justify-self", "stretch");
    else if (this.rowLayout) {
      if (node.style.value("width") !== undefined)
        node.style.raw("flex-shrink", "0");
      node.style.raw("align-self", "flex-start");
    } else
      node.style
        .raw("align-self", "flex-start")
        .raw("justify-self", "flex-start");
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
