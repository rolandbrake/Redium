import { Element, type ElementOptions } from "../core/Element.js";
import { State } from "../state/State.js";
export type ButtonText = string | State<any>;
export interface ButtonOptions extends ElementOptions {
    text?: ButtonText;
    onClick?: (this: ButtonElement, event: Event) => void;
    disabled?: boolean | State<boolean>;
}
export declare class ButtonElement extends Element {
    constructor(textOrOptions?: ButtonText | ButtonOptions, options?: ButtonOptions);
    private setText;
    get text(): string;
    set text(value: string);
    get disabled(): boolean;
    set disabled(value: boolean);
}
export type Button = ButtonElement;
export interface ButtonFactory {
    (textOrOptions?: ButtonText | ButtonOptions, options?: ButtonOptions): ButtonElement;
    new (textOrOptions?: ButtonText | ButtonOptions, options?: ButtonOptions): ButtonElement;
}
export declare const Button: ButtonFactory;
//# sourceMappingURL=Button.d.ts.map