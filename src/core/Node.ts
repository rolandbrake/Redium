export type EventHandler<T = unknown> = (payload: T) => void;
export type Unsubscribe = () => void;

/** The identity and hierarchy primitive for every framework object. */
export abstract class Node {
  parent: Node | null = null;
  readonly children: Node[] = [];
  private listeners = new Map<string, Set<EventHandler>>();

  add(...nodes: Node[]): this {
    for (const node of nodes) {
      if (node === this) throw new Error("A node cannot contain itself.");
      if (this.contains(node))
        throw new Error("A node cannot contain one of its ancestors.");
      if (node.parent) node.parent.remove(node);
      node.parent = this;
      this.children.push(node);
      this.onChildAdded(node);
    }
    return this;
  }

  addFirst(...nodes: Node[]): this {
    for (const node of [...nodes].reverse()) {
      if (node === this || this.contains(node))
        throw new Error("Invalid parent-child relationship.");
      if (node.parent) node.parent.remove(node);
      node.parent = this;
      this.children.unshift(node);
      this.onChildAdded(node);
    }
    return this;
  }

  remove(node: Node): this {
    const index = this.children.indexOf(node);
    if (index >= 0) {
      this.children.splice(index, 1);
      node.parent = null;
      this.onChildRemoved(node);
    }
    return this;
  }

  removeAll(): this {
    for (const child of [...this.children]) this.remove(child);
    return this;
  }
  contains(node: Node): boolean {
    return node === this || this.children.some((child) => child.contains(node));
  }

  on<T = unknown>(event: string, handler: EventHandler<T>): this {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(handler as EventHandler);
    return this;
  }

  off<T = unknown>(event: string, handler: EventHandler<T>): this {
    this.listeners.get(event)?.delete(handler as EventHandler);
    return this;
  }

  emit<T = unknown>(event: string, payload?: T): void {
    this.listeners.get(event)?.forEach((handler) => handler(payload));
  }

  protected onChildAdded(_node: Node): void {}
  protected onChildRemoved(_node: Node): void {}
}
