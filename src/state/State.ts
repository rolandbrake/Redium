import type { Unsubscribe } from "../core/Node.js";

export type Subscriber<T> = (value: T) => void;
let activeObserver: (() => void) | null = null;

/** A small reactive value. Writes notify only the objects subscribed to it. */
export class State<T> {
  private current: T;
  private subscribers = new Set<Subscriber<T>>();
  constructor(initial: T) {
    this.current = initial;
  }

  get value(): T {
    if (activeObserver) this.subscribers.add(activeObserver as Subscriber<T>);
    return this.current;
  }
  set value(next: T) {
    if (Object.is(this.current, next)) return;
    this.current = next;
    [...this.subscribers].forEach((subscriber) => subscriber(next));
  }
  subscribe(fn: Subscriber<T>): Unsubscribe {
    this.subscribers.add(fn);
    fn(this.current);
    return () => this.subscribers.delete(fn);
  }
  map<U>(fn: (value: T) => U): State<U> {
    const result = new State(fn(this.current));
    this.subscribe((value) => {
      result.value = fn(value);
    });
    return result;
  }
  static isState<T = unknown>(value: unknown): value is State<T> {
    return value instanceof State;
  }
}

/** Re-run a small computation when any State read by it changes. */
export function createEffect(fn: () => void): Unsubscribe {
  let stopped = false;
  const run = () => {
    if (!stopped) {
      activeObserver = run;
      try {
        fn();
      } finally {
        activeObserver = null;
      }
    }
  };
  run();
  return () => {
    stopped = true;
  };
}

export function createSelector<T>(fn: () => T): State<T> {
  const result = new State(fn());
  createEffect(() => {
    result.value = fn();
  });
  return result;
}

export function createState<T>(initial: T): State<T> {
  return new State(initial);
}

export const effect = createEffect;
export const selector = createSelector;
export const state = createState;
