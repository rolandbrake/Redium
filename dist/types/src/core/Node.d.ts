export type EventHandler<T = unknown> = (payload: T) => void;
export type Unsubscribe = () => void;
/** The identity and hierarchy primitive for every framework object. */
export declare abstract class Node {
    parent: Node | null;
    readonly children: Node[];
    private listeners;
    add(...nodes: Node[]): this;
    addFirst(...nodes: Node[]): this;
    remove(node: Node): this;
    removeAll(): this;
    contains(node: Node): boolean;
    on<T = unknown>(event: string, handler: EventHandler<T>): this;
    off<T = unknown>(event: string, handler: EventHandler<T>): this;
    emit<T = unknown>(event: string, payload?: T): void;
    protected onChildAdded(_node: Node): void;
    protected onChildRemoved(_node: Node): void;
}
//# sourceMappingURL=Node.d.ts.map