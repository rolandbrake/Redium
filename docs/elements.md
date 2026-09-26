# Elements

## `Container`

`Container` is the general-purpose layout element. It is a vertical flex container by default.

```ts
Container({
  width: 0.9, // fractional dimensions are parent ratios
  maxWidth: 640,
  padding: [24, 32],
  gap: 12,
  children: [Text("A panel")],
});
```

Options include `children`, dimensions, `padding`, `margin`, `gap`, `row`, `wrap`, `center`, `shrink`, and `grow`.

Use `Container({ row: true })` when the low-level direction flag is useful.
For clearer intent, prefer `Row(...)` or `Column(...)`; their direction is
fixed by the helper and cannot be accidentally changed through options.

## `Text`

`Text` creates a span and accepts a string, number, or reactive state:

```ts
Text("Static text");
Text(42);
Text(count.map((value) => `Total: ${value}`));
```

Text is block-level by default, uses normal whitespace, and breaks long
unbroken content when necessary so it does not force a responsive parent wider.

## `Button`

```ts
Button("Save", {
  disabled: isSaving,
  onClick(event) {
    console.log("saved", event);
  },
});
```

`disabled` can be a boolean or `State<boolean>`. Button text can also be reactive.
Buttons inherit the surrounding typography by default. An explicit `font` or
other typography style on the button takes precedence.


## Hierarchy

```ts
const container = Column();
container.add(Text("First"));
container.addFirst(Text("Before first"));
container.removeAll();
```

An element can have only one parent. Adding it to another parent moves it from the previous one. Non-container elements reject children.

`add(a, b)` appends children; `addFirst(a, b)` prepends them in that order.
Both keep the logical child list and DOM order aligned. Adding an existing child
moves it to the requested position without duplicating it, and descendants can
be moved up to an ancestor container.

A node cannot contain itself or one of its ancestors. Both methods validate all
arguments for these relationships before moving any nodes. `remove(child)`
detaches a direct child, while `removeAll()` detaches every direct child.

## Lifecycle

Every element accepts `onMount` and `onDispose` options. See the dedicated
[Lifecycle guide](lifecycle.md) for mounting, cleanup, ownership, reactive
bindings, and disposal rules.

[Next: Lifecycle](lifecycle.md)
