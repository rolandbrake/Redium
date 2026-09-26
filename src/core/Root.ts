import { styles } from "../style/Style.js";
import { ContainerElement } from "../elements/Container.js";
import type { ContainerOptions } from "../elements/Container.js";

export type RootOptions = Omit<
  ContainerOptions,
  "children" | "padding" | "row" | "wrap" | "center"
>;

/** The single application root. Its only child is the supplied body container. */
export class RootElement extends ContainerElement {
  readonly body: ContainerElement;

  constructor(body: ContainerElement, options: RootOptions = {}) {
    super(options);
    this.body = body;
    super.add(this.body);

    styles(this.style)
      .default("width", "100vw")
      .default("height", "100vh")
      .default("max-width", "100vw")
      .default("max-height", "100vh")
      .default("min-width", "0")
      .default("min-height", "0")
      .default("overflow-x", "hidden")
      .default("overflow-y", "auto");
  }

  /** Add application content to Root.body, keeping Root's hierarchy fixed. */
  override add(...nodes: import("../core/Node.js").Node[]): this {
    this.body.add(...nodes);
    return this;
  }

  mountElement(target: HTMLElement = document.body): this { return super.mountElement(target); }
}

export type Root = RootElement;
export interface RootFactory {
  (body: ContainerElement, options?: RootOptions): RootElement;
  new (body: ContainerElement, options?: RootOptions): RootElement;
}
export const Root = function(body: ContainerElement, options: RootOptions = {}) {
  return new RootElement(body, options);
} as RootFactory;
