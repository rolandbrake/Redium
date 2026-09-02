import type { Unsubscribe } from "../core/Node.js";
export type Subscriber<T> = (value: T) => void;
/** A small reactive value. Writes notify only the objects subscribed to it. */
export declare class State<T> {
    private current;
    private subscribers;
    constructor(initial: T);
    get value(): T;
    set value(next: T);
    subscribe(fn: Subscriber<T>): Unsubscribe;
    map<U>(fn: (value: T) => U): State<U>;
    static isState<T = unknown>(value: unknown): value is State<T>;
}
/** Re-run a small computation when any State read by it changes. */
export declare function createEffect(fn: () => void): Unsubscribe;
export declare function createSelector<T>(fn: () => T): State<T>;
export declare function createState<T>(initial: T): State<T>;
export declare const effect: typeof createEffect;
export declare const selector: typeof createSelector;
export declare const state: typeof createState;
//# sourceMappingURL=State.d.ts.map