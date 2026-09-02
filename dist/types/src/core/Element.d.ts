import { Node, type EventHandler } from "./Node.js";
import { State } from "../state/State.js";
import { Style, type StyleConfig } from "../style/Style.js";
export interface ElementOptions {
    style?: Style | StyleConfig;
    id?: string;
    className?: string;
}
/** A Node with one DOM projection and semantic interaction APIs. */
export declare abstract class Element extends Node {
    readonly dom: HTMLElement;
    readonly style: Style;
    private _hovering?;
    private _focused?;
    private _pressed?;
    private _clicked?;
    protected readonly canContainChildren: boolean;
    protected constructor(tag: string, options?: ElementOptions);
    add(...nodes: Node[]): this;
    addFirst(...nodes: Node[]): this;
    protected onChildAdded(node: Node): void;
    protected onChildRemoved(node: Node): void;
    on<T = unknown>(event: string, handler: EventHandler<T>): this;
    off<T = unknown>(event: string, handler: EventHandler<T>): this;
    attr(name: string, value?: string): this | string | null;
    show(): this;
    hide(): this;
    get hovering(): State<boolean>;
    get focused(): State<boolean>;
    get pressed(): State<boolean>;
    get clicked(): State<number>;
    onClick(fn: (event: Event) => void): this;
    onHover(fn: (value: boolean) => void): this;
    onFocus(fn: (value: boolean) => void): this;
    onPress(fn: (value: boolean) => void): this;
    mount(target?: HTMLElement): this;
    unmount(): this;
}
//# sourceMappingURL=Element.d.ts.map