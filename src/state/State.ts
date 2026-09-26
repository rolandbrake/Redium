export type Subscriber<T> = (value: T) => void;
export type Unsubscribe = () => void;

interface Observer {
  run: () => void;
  dependencies: Map<object, Unsubscribe>;
  stopped: boolean;
}

let activeObserver: Observer | null = null;

/** A small reactive value. Writes notify only the objects subscribed to it. */
export class State<T> {
  private current: T;
  private subscribers = new Set<Subscriber<T>>();

  constructor(initial: T) {
    this.current = initial;
  }

  get value(): T {
    const observer = activeObserver;
    if (observer && !observer.stopped && !observer.dependencies.has(this)) {
      this.subscribers.add(observer.run);
      observer.dependencies.set(this, () =>
        this.subscribers.delete(observer.run),
      );
    }
    return this.current;
  }

  set value(next: T) {
    if (Object.is(this.current, next)) return;
    this.current = next;
    [...this.subscribers].forEach((subscriber) => {
      if (this.subscribers.has(subscriber)) subscriber(next);
    });
  }
  subscribe(fn: Subscriber<T>): Unsubscribe {
    this.subscribers.add(fn);
    try {
      fn(this.current);
    } catch (error) {
      this.subscribers.delete(fn);
      throw error;
    }
    return () => this.subscribers.delete(fn);
  }

  map<U>(fn: (value: T) => U): State<U> {
    let result: State<U> | undefined;
    this.subscribe((value) => {
      const mapped = fn(value);
      if (result === undefined) result = new State(mapped);
      else result.value = mapped;
    });
    return result!;
  }

  static isState<T = unknown>(value: unknown): value is State<T> {
    return value instanceof State;
  }
}

/** Re-run a small computation when any State read by it changes. */
function observe(fn: () => void): void {
  let running = false;
  const cleanup = () => {
    observer.dependencies.forEach((unsubscribe) => unsubscribe());
    observer.dependencies.clear();
  };
  const stop = () => {
    observer.stopped = true;
    cleanup();
  };
  const observer: Observer = {
    stopped: false,
    dependencies: new Map(),
    run: () => {
      if (observer.stopped) return;
      if (running)
        throw new Error("A selector cannot update its own dependencies.");
      cleanup();
      const previous = activeObserver;
      activeObserver = observer;
      running = true;
      try {
        fn();
      } catch (error) {
        // Failed calculations must not retain partial subscriptions.
        stop();
        throw error;
      } finally {
        running = false;
        activeObserver = previous;
      }
    },
  };
  observer.run();
}

export function createSelector<T>(fn: () => T): State<T> {
  let result: State<T> | undefined;
  observe(() => {
    const value = fn();
    if (result === undefined) result = new State(value);
    else result.value = value;
  });
  return result!;
}

export function createState<T>(initial: T): State<T> {
  return new State(initial);
}
