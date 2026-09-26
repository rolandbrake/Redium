# Stack

`Stack` is a layered layout element. Its children occupy the same grid area, so
they overlap along the z-axis. Children added later appear above earlier
children.

```ts
const stack = Stack({
  children: [
    Text("Base layer"),
    Text("Badge"),
  ],
});
```

`Stack` is useful for badges, cards with overlays, dialogs, popovers, and small
local layer groups. It is an ordinary element with the same styling, hierarchy,
and lifecycle behavior as `Container`.

## Visual order

Every child occupies one shared CSS Grid cell. By default, the child order is
its layer order:

```text
Stack
 ├─ first child   z-index: 0
 ├─ second child  z-index: 1
 └─ third child   z-index: 2  ← top layer
```

This default is enough for normal `push` and `pop` usage. For a deliberate
override, use `zIndex` in the element style:

```ts
Stack({
  children: [
    Text("Background"),
    Text("Always above", { style: { zIndex: 100 } }),
  ],
});
```

`zIndex` must be an integer. Use it sparingly: explicit values can make a stack
harder to reason about than its natural child order.

## Stack operations

`Stack` also provides a small ownership API for temporary layers:

```ts
const overlays = Stack();
const dialog = Dialog();

overlays.push(dialog); // Adds the new top layer.
overlays.peek();       // Returns dialog without changing the stack.
overlays.pop();        // Removes and disposes dialog.
```

`push(...elements)` appends layers. If the stack is mounted, pushed elements
mount automatically.

`pop()` returns the top `Element`, or `undefined` when the stack is empty. A
popped element is **disposed**, so it cannot be pushed or mounted again. This is
appropriate for a closed dialog, dismissed toast, or completed overlay: its
timers, listeners, requests, and reactive bindings are cleaned up.

`clear()` disposes every current layer, from top to bottom:

```ts
overlays.clear();
```

Use `unmount()` on a child instead of `pop()` when the same layer should be
temporarily hidden and later reused.

## Dialog example

```ts
const layers = Stack({ center: true });

function Dialog(message: string) {
  return Column({
    padding: 24,
    style: { width: 0.8, maxWidth: 360, background: "#ffffff", radius: 12 },
    children: [
      Text(message),
      Button("Close", { onClick: () => layers.pop() }),
    ],
  });
}

layers.push(Dialog("Saved successfully"));
```

The close button calls `pop`, so the top dialog is removed and disposed through
the normal [Lifecycle](lifecycle.md) rules.

## Scope

`Stack` is a local visual and ownership primitive. It does not yet create a
portal to `document.body`, trap keyboard focus, lock page scrolling, or provide
modal accessibility semantics. Those behaviors belong in a future `Dialog` or
overlay primitive built on top of `Stack`.

See the runnable [`stack.ts`](../example/stack.ts) example.

[Next: API Reference](api.md)
