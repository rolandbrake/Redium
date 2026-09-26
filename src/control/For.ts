import { Element } from "../core/Element.js";
import { createState, State } from "../state/State.js";
import { ControlElement } from "./Control.js";

export type Key = string | number;

export interface ForOptions<T> {
  /** Stable application identity. This is not written to the DOM as an id. */
  key: (item: T) => Key;
}

interface ForRecord<T> {
  item: State<T>;
  index: State<number>;
  element: Element;
}

class ForElement<T> extends ControlElement {
  private records = new Map<Key, ForRecord<T>>();

  constructor(
    items: State<T[]>,
    private readonly render: (item: State<T>, index: State<number>) => Element,
    private readonly options: ForOptions<T>,
  ) {
    super();
    this.onMount(() => items.subscribe((value) => this.reconcile(value)));
  }

  private reconcile(items: readonly T[]): void {
    const entries = items.map((item, index) => ({
      item,
      index,
      key: this.validateKey(this.options.key(item)),
    }));
    const keys = new Set<Key>();
    for (const { key } of entries) {
      if (keys.has(key))
        throw new Error(`For received duplicate key: ${String(key)}.`);
      keys.add(key);
    }

    const previous = new Map(this.records);
    const next = new Map<Key, ForRecord<T>>();
    for (const { item, index, key } of entries) {
      let record = previous.get(key);
      if (record) {
        previous.delete(key);
        record.item.value = item;
        record.index.value = index;
      } else {
        const itemState = createState(item);
        const indexState = createState(index);
        record = {
          item: itemState,
          index: indexState,
          element: this.render(itemState, indexState),
        };
      }
      next.set(key, record);
    }

    for (const { element } of previous.values()) element.dispose();
    this.records = next;
    for (const { element } of next.values()) this.add(element);
  }

  private validateKey(key: Key): Key {
    if (typeof key === "string") return key;
    if (typeof key === "number" && Number.isFinite(key)) return key;
    throw new Error("For keys must be strings or finite numbers.");
  }
}

/** Render keyed branches for a reactive array. */
export function For<T>(
  items: State<T[]>,
  render: (item: State<T>, index: State<number>) => Element,
  options: ForOptions<T>,
): Element {
  return new ForElement(items, render, options);
}
