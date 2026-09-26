import { domOf } from "../core/_dom.js";
import { styles } from "../style/Style.js";
import { Element, type ElementOptions } from "../core/Element.js";
import { State } from "../state/State.js";
export type TextContent = string | number | State<any>;
export class TextElement extends Element {
  constructor(
    content: TextContent,
    options: ElementOptions = {},
  ) {
    super("span", options);
    // Block layout makes width, wrapping, and alignment predictable when
    // Text is used outside a flex/grid formatting context.
    styles(this.style)
      .default("display", "block")
      .default("white-space", "normal")
      .default("overflow-wrap", "anywhere");
    if (State.isState(content)) {
      this.text = String(content.value);
      this.onMount(() =>
        content.subscribe((value) => { this.text = String(value); }),
      );
    } else this.text = String(content);
  }
  get text(): string {
    return domOf(this).textContent ?? "";
  }
  set text(value: string) {
    domOf(this).textContent = value;
  }
}
export type Text = TextElement;
export interface TextFactory {
  (
    content: TextContent,
    options?: ElementOptions,
  ): TextElement;
  new (
    content: TextContent,
    options?: ElementOptions,
  ): TextElement;
}
export const Text = function (
  content: TextContent,
  options: ElementOptions = {},
) {
  return new TextElement(content, options);
} as TextFactory;
