import { ContainerElement } from "../elements/Container.js";
import type { ContainerOptions } from "../elements/Container.js";

export interface RootOptions extends Omit<ContainerOptions, "children" | "padding"> {
  body: ContainerElement;
}

/** The single application root. Its only child is the supplied body container. */
export class RootElement extends ContainerElement {
  readonly body: ContainerElement;

  constructor(options: RootOptions) {
    super(options);
    this.body = options.body;
    super.add(this.body);

    this.style
      .raw("width", "100vw")
      .raw("height", "100vh")
      .raw("max-width", "100vw")
      .raw("max-height", "100vh")
      .raw("min-width", "0")
      .raw("min-height", "0")
      .raw("overflow-x", "hidden")
      .raw("overflow-y", "auto");
  }

  /** Add application content to Root.body, keeping Root's hierarchy fixed. */
  override add(...nodes: import("../core/Node.js").Node[]): this {
    this.body.add(...nodes);
    return this;
  }

  mount(target: HTMLElement = document.body): this { return super.mount(target); }
}

export type Root = RootElement;
export interface RootFactory { (options: RootOptions): RootElement; new (options: RootOptions): RootElement; }
export const Root = function(options: RootOptions) { return new RootElement(options); } as RootFactory;