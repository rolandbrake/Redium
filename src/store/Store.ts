import {
  createSelector,
  State,
  type Subscriber,
  type Unsubscribe,
} from "../state/State.js";

export type StateUpdater<T> = (current: T) => T;

/** A named application state container with selective reactive reads. */
export class Store<T> extends State<T> {
  /** Read the current whole store state. */
  getState(): T {
    return this.value;
  }

  /** Replace the whole store state. */
  setState(next: T): this {
    this.value = next;
    return this;
  }

  /** Replace state with the result of an immutable update function. */
  updateState(update: StateUpdater<T>): this {
    return this.setState(update(this.value));
  }

  /** Create reactive state for one selected part of the store. */
  selectState<U>(selector: (state: T) => U): State<U> {
    return createSelector(() => selector(this.value));
  }

  /** Observe whole-store changes; returns an unsubscribe function. */
  subscribeState(listener: Subscriber<T>): Unsubscribe {
    return this.subscribe(listener);
  }
}

/** Create an explicit application store. */
export function createStore<T>(initial: T): Store<T> {
  return new Store(initial);
}
