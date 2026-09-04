# Elements

## `Container`

`Container` is the general-purpose layout element. It is a vertical flex container by default.

```ts
Container({
  width: 0.9,
  maxWidth: 640,
  padding: [24, 32],
  gap: 12,
  children: [Text("A panel")],
});
```

Options include `children`, dimensions, `padding`, `margin`, `gap`, `row`, `wrap`, `center`, `shrink`, and `grow`.

## `Text`

`Text` creates a span and accepts a string, number, or reactive state:

```ts
Text("Static text");
Text(42);
Text(count.map((value) => `Total: ${value}`));
```

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

## Hierarchy

```ts
const container = Column();
container.add(Text("First"));
container.addFirst(Text("Before first"));
container.removeAll();
```

An element can have only one parent. Adding it to another parent moves it from the previous one. Non-container elements reject children.

[Next: State →](state.md)
