import { Element, type ElementOptions } from "../core/Element.js";
import { State } from "../state/State.js";
export declare class TextElement extends Element {
    constructor(content: string | number | State<string> | State<number>, options?: ElementOptions);
    get text(): string;
    set text(value: string);
}
export type Text = TextElement;
export interface TextFactory {
    (content: string | number | State<string> | State<number>, options?: ElementOptions): TextElement;
    new (content: string | number | State<string> | State<number>, options?: ElementOptions): TextElement;
}
export declare const Text: TextFactory;
//# sourceMappingURL=Text.d.ts.map