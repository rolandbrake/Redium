import { Element, type ElementOptions } from "../core/Element.js";
import { State } from "../state/State.js";

export type ButtonText = string | State<any>;
export interface ButtonOptions extends ElementOptions {
  text?: ButtonText;
  onClick?: (this: ButtonElement, event: Event) => void;
  disabled?: boolean | State<boolean>;
}

export class ButtonElement extends Element {
  constructor(
    textOrOptions?: ButtonText | ButtonOptions,
    options: ButtonOptions = {},
  ) {
    const opts: ButtonOptions =
      typeof textOrOptions === "string" || State.isState(textOrOptions)
        ? { ...options, text: textOrOptions as ButtonText }
        : (textOrOptions ?? {});
    super("button", opts);
    this.style
      .default("min-width", "5rem")
      .default("min-height", "2.75rem")
      .default("padding", "0.625rem 1rem")
      .default("font-size", "1rem")
      .default("line-height", "1.2")
      .default("touch-action", "manipulation");
    if (opts.text !== undefined) this.setText(opts.text);
    if (opts.onClick) this.onClick(opts.onClick.bind(this));
    if (State.isState(opts.disabled))
      opts.disabled.subscribe((value) => (this.disabled = Boolean(value)));
    else if (typeof opts.disabled === "boolean") this.disabled = opts.disabled;
  }

  private setText(value: ButtonText): void {
    if (State.isState<string>(value))
      value.subscribe((next) => (this.text = next));
    else this.text = value as string;
  }

  get text(): string {
    return this.dom.textContent ?? "";
  }
  set text(value: string) {
    this.dom.textContent = value;
  }
  get disabled(): boolean {
    return (this.dom as HTMLButtonElement).disabled;
  }
  set disabled(value: boolean) {
    (this.dom as HTMLButtonElement).disabled = value;
    this.attr("aria-disabled", String(value));
  }
}

export type Button = ButtonElement;
export interface ButtonFactory {
  (
    textOrOptions?: ButtonText | ButtonOptions,
    options?: ButtonOptions,
  ): ButtonElement;
  new (
    textOrOptions?: ButtonText | ButtonOptions,
    options?: ButtonOptions,
  ): ButtonElement;
}
export const Button = function (
  textOrOptions?: ButtonText | ButtonOptions,
  options: ButtonOptions = {},
) {
  return new ButtonElement(textOrOptions, options);
} as ButtonFactory;
