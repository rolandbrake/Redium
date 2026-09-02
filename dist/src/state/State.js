let activeObserver = null;
/** A small reactive value. Writes notify only the objects subscribed to it. */
export class State {
    constructor(initial) {
        this.subscribers = new Set();
        this.current = initial;
    }
    get value() {
        if (activeObserver)
            this.subscribers.add(activeObserver);
        return this.current;
    }
    set value(next) {
        if (Object.is(this.current, next))
            return;
        this.current = next;
        [...this.subscribers].forEach((subscriber) => subscriber(next));
    }
    subscribe(fn) {
        this.subscribers.add(fn);
        fn(this.current);
        return () => this.subscribers.delete(fn);
    }
    map(fn) {
        const result = new State(fn(this.current));
        this.subscribe((value) => {
            result.value = fn(value);
        });
        return result;
    }
    static isState(value) {
        return value instanceof State;
    }
}
/** Re-run a small computation when any State read by it changes. */
export function createEffect(fn) {
    let stopped = false;
    const run = () => {
        if (!stopped) {
            activeObserver = run;
            try {
                fn();
            }
            finally {
                activeObserver = null;
            }
        }
    };
    run();
    return () => {
        stopped = true;
    };
}
export function createSelector(fn) {
    const result = new State(fn());
    createEffect(() => {
        result.value = fn();
    });
    return result;
}
export function createState(initial) {
    return new State(initial);
}
export const effect = createEffect;
export const selector = createSelector;
export const state = createState;
