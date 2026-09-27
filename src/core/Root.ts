import { ContainerElement } from "../elements/Container.js";
import type { ContainerOptions } from "../elements/Container.js";
import type { Node } from "./Node.js";

export type RootOptions = Omit<
  ContainerOptions,
  "children" | "padding" | "row" | "wrap" | "center"
>;

/** The single application root. Its only child is the supplied body container. */
export class RootElement extends ContainerElement {
  readonly body: ContainerElement;

  constructor(body: ContainerElement, options: RootOptions = {}) {
    super(options);
    this.setElementKind("root");
    this.body = body;
    super.add(this.body);

  }

  /** Add application content to Root.body, keeping Root's hierarchy fixed. */
  override add(...nodes: Node[]): this {
    this.body.add(...nodes);
    return this;
  }

  mountElement(target: HTMLElement = document.body): this {
    return super.mountElement(target);
  }
}

export type Root = RootElement;
export interface RootFactory {
  (body: ContainerElement, options?: RootOptions): RootElement;
  new (body: ContainerElement, options?: RootOptions): RootElement;
}
export const Root = function (
  body: ContainerElement,
  options: RootOptions = {},
) {
  return new RootElement(body, options);
} as RootFactory;
