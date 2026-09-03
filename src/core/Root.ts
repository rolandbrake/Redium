import { ContainerElement } from "../elements/Container.js";
import type { ContainerOptions } from "../elements/Container.js";
import { Style } from "../style/Style.js";

export type RootOptions = Omit<ContainerOptions, "children" | "padding">;

/** The single application root. Its only child is the supplied body container. */
export class RootElement extends ContainerElement {
  readonly body: ContainerElement;

  constructor(body: ContainerElement, options: RootOptions = {}) {
    const style = options.style;
    const hasStyleValue = (property: string, configKey = property): boolean =>
      style instanceof Style
        ? style.value(property) !== undefined
        : style !== undefined && configKey in style;
    const customWidth = options.width !== undefined || hasStyleValue("width");
    const customHeight = options.height !== undefined || hasStyleValue("height");
    const customMaxWidth = options.maxWidth !== undefined || hasStyleValue("max-width", "maxWidth");
    const customMaxHeight = options.maxHeight !== undefined || hasStyleValue("max-height", "maxHeight");
    super(options);
    this.body = body;
    super.add(this.body);

    if (!customWidth) this.style.raw("width", "100vw");
    if (!customHeight) this.style.raw("height", "100vh");
    if (!customMaxWidth) this.style.raw("max-width", "100vw");
    if (!customMaxHeight) this.style.raw("max-height", "100vh");
    this.style
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

  mount(target: HTMLElement = document.body): this { return super.mount(target); }
}

export type Root = RootElement;
export interface RootFactory {
  (body: ContainerElement, options?: RootOptions): RootElement;
  new (body: ContainerElement, options?: RootOptions): RootElement;
}
export const Root = function(body: ContainerElement, options: RootOptions = {}) {
  return new RootElement(body, options);
} as RootFactory;
