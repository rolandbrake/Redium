
/** The identity and hierarchy primitive for every library object. */
export abstract class Node {
  parent: Node | null = null;
  readonly children: Node[] = [];
  add(...nodes: Node[]): this {
    this.validateChildren(nodes);
    for (const node of nodes) {
      if (node.parent === this) this.children.splice(this.children.indexOf(node), 1);
      else {
        if (node.parent) node.parent.remove(node);
        node.parent = this;
      }
      this.children.push(node);
      this.onChildAdded(node);
    }
    return this;
  }

  addFirst(...nodes: Node[]): this {
    this.validateChildren(nodes);
    for (const node of [...nodes].reverse()) {
      if (node.parent === this) this.children.splice(this.children.indexOf(node), 1);
      else {
        if (node.parent) node.parent.remove(node);
        node.parent = this;
      }
      this.children.unshift(node);
      this.onChildAdded(node);
    }
    return this;
  }

  private validateChildren(nodes: Node[]): void {
    // Validate the whole request before detaching anything. Walk upward from
    // the destination: existing descendants may be moved, ancestors may not.
    const incoming = new Set(nodes);
    if (incoming.has(this)) throw new Error("A node cannot contain itself.");
    for (let ancestor = this.parent; ancestor; ancestor = ancestor.parent) {
      if (incoming.has(ancestor))
        throw new Error("A node cannot contain one of its ancestors.");
    }
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

  protected onChildAdded(node: Node): void {}
  protected onChildRemoved(node: Node): void {}
}
