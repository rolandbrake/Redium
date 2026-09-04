import { Element, type ElementOptions } from "../core/Element.js";
import { State } from "../state/State.js";
export class TextElement extends Element {
  constructor(
    content: string | number | State<string> | State<number>,
    options: ElementOptions = {},
  ) {
    super("span", options);
    // Block layout makes width, wrapping, and alignment predictable when
    // Text is used outside a flex/grid formatting context.
    this.style.default("display", "block");
    if (State.isState(content))
      content.subscribe((value) => (this.text = String(value)));
    else this.text = String(content);
  }
  get text(): string {
    return this.dom.textContent ?? "";
  }
  set text(value: string) {
    this.dom.textContent = value;
  }
}
export type Text = TextElement;
export interface TextFactory {
  (
    content: string | number | State<string> | State<number>,
    options?: ElementOptions,
  ): TextElement;
  new (
    content: string | number | State<string> | State<number>,
    options?: ElementOptions,
  ): TextElement;
}
export const Text = function (
  content: string | number | State<string> | State<number>,
  options: ElementOptions = {},
) {
  return new TextElement(content, options);
} as TextFactory;
