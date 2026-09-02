import { Element, type ElementOptions } from "../core/Element.js";
import type { Node } from "../core/Node.js";
import { type SizeValue } from "../style/Size.js";
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
export declare class ContainerElement extends Element {
    protected readonly canContainChildren = true;
    private readonly originalWidths;
    private readonly rowLayout;
    private readonly centerLayout;
    private observer?;
    private childrenAreWrapped;
    constructor(options?: ContainerOptions);
    private validateRatio;
    private applySize;
    private sizeValue;
    private watchWrapping;
    private updateWrappedChildren;
    private applyRelativeWidths;
    private number;
    protected onChildAdded(node: Node): void;
}
export type Container = ContainerElement;
export interface ContainerFactory {
    (options?: ContainerOptions): ContainerElement;
    new (options?: ContainerOptions): ContainerElement;
}
export declare const Container: ContainerFactory;
//# sourceMappingURL=Container.d.ts.map