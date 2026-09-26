import { domOf } from "../core/_dom.js";
import { styles } from "../style/Style.js";
import { Element, type ElementOptions } from "../core/Element.js";
import { State } from "../state/State.js";

export type ButtonText = string | State<any>;
export interface ButtonOptions extends ElementOptions {
  text?: ButtonText;
  onClick?: (this: ButtonElement) => void;
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
    styles(this.style)
      .default("min-width", "5rem")
      .default("min-height", "2.75rem")
      .default("padding", "0.625rem 1rem")
      // Buttons inherit application typography unless the caller supplies a
      // font, font size, or weight explicitly.
      .default("font-family", "inherit")
      .default("font-size", "inherit")
      .default("font-weight", "inherit")
      .default("line-height", "1.2")
      .default("touch-action", "manipulation");
    if (opts.text !== undefined) this.setText(opts.text);
    if (opts.onClick) this.onClick(opts.onClick.bind(this));
    const disabled = opts.disabled;
    if (State.isState(disabled)) {
      this.disabled = Boolean(disabled.value);
      this.onMount(() =>
        disabled.subscribe((value) => {
          this.disabled = Boolean(value);
        }),
      );
    } else if (typeof opts.disabled === "boolean")
      this.disabled = opts.disabled;
  }

  private setText(value: ButtonText): void {
    if (State.isState<string>(value)) {
      this.text = value.value;
      this.onMount(() =>
        value.subscribe((next) => {
          this.text = next;
        }),
      );
    } else this.text = value as string;
  }

  get text(): string {
    return domOf(this).textContent ?? "";
  }
  set text(value: string) {
    domOf(this).textContent = value;
  }
  get disabled(): boolean {
    return (domOf(this) as HTMLButtonElement).disabled;
  }
  set disabled(value: boolean) {
    (domOf(this) as HTMLButtonElement).disabled = value;
    domOf(this).setAttribute("aria-disabled", String(value));
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
