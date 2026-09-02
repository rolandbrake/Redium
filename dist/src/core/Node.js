/** The identity and hierarchy primitive for every framework object. */
export class Node {
    constructor() {
        this.parent = null;
        this.children = [];
        this.listeners = new Map();
    }
    add(...nodes) {
        for (const node of nodes) {
            if (node === this)
                throw new Error("A node cannot contain itself.");
            if (this.contains(node))
                throw new Error("A node cannot contain one of its ancestors.");
            if (node.parent)
                node.parent.remove(node);
            node.parent = this;
            this.children.push(node);
            this.onChildAdded(node);
        }
        return this;
    }
    addFirst(...nodes) {
        for (const node of [...nodes].reverse()) {
            if (node === this || this.contains(node))
                throw new Error("Invalid parent-child relationship.");
            if (node.parent)
                node.parent.remove(node);
            node.parent = this;
            this.children.unshift(node);
            this.onChildAdded(node);
        }
        return this;
    }
    remove(node) {
        const index = this.children.indexOf(node);
        if (index >= 0) {
            this.children.splice(index, 1);
            node.parent = null;
            this.onChildRemoved(node);
        }
        return this;
    }
    removeAll() {
        for (const child of [...this.children])
            this.remove(child);
        return this;
    }
    contains(node) {
        return node === this || this.children.some((child) => child.contains(node));
    }
    on(event, handler) {
        if (!this.listeners.has(event))
            this.listeners.set(event, new Set());
        this.listeners.get(event).add(handler);
        return this;
    }
    off(event, handler) {
        this.listeners.get(event)?.delete(handler);
        return this;
    }
    emit(event, payload) {
        this.listeners.get(event)?.forEach((handler) => handler(payload));
    }
    onChildAdded(_node) { }
    onChildRemoved(_node) { }
}
