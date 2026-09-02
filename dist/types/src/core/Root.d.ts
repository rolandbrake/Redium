import { ContainerElement } from "../elements/Container.js";
import type { ContainerOptions } from "../elements/Container.js";
export type RootOptions = Omit<ContainerOptions, "children" | "padding">;
/** The single application root. Its only child is the supplied body container. */
export declare class RootElement extends ContainerElement {
    readonly body: ContainerElement;
    constructor(body: ContainerElement, options?: RootOptions);
    /** Add application content to Root.body, keeping Root's hierarchy fixed. */
    add(...nodes: import("../core/Node.js").Node[]): this;
    mount(target?: HTMLElement): this;
}
export type Root = RootElement;
export interface RootFactory {
    (body: ContainerElement, options?: RootOptions): RootElement;
    new (body: ContainerElement, options?: RootOptions): RootElement;
}
export declare const Root: RootFactory;
//# sourceMappingURL=Root.d.ts.map