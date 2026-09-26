# Redium Documentation

Redium is a small, declarative, TypeScript-first UI library. Components are ordinary functions that return DOM-backed elements, and state is explicit and reactive.

## Sections

1. [Introduction](introduction.md) - concepts and project status
2. [Basics](basics.md) - installation, mounting, and a first application
3. [Elements](elements.md) - components and element hierarchy
4. [Lifecycle](lifecycle.md) - mounting, cleanup, ownership, and disposal
5. [Control Flow](control-flow.md) - conditional branches and keyed lists
6. [State](state.md) - reactive values and selectors
7. [Store](store.md) - shared application state and selected values
8. [Styling](styling.md) - reusable styles and DOM events
9. [Units](units.md) - dimensions, pixels, fonts, and CSS functions
10. [Layout](layout.md) - rows, columns, grids, and responsive widths
11. [Stack](stack.md) - layered content and stack operations
12. [API Reference](api.md) - public exports

## Quick start

```ts
import { Button, Column, Root, Text, createState, mountElement } from "redium";

const count = createState(0);
const body = Column({
  gap: 16,
  padding: 24,
  children: [
    Text(count.map((value) => `Clicked ${value} times`)),
    Button("Click me", { onClick: () => count.value++ }),
  ],
});

mountElement(Root(body));
```

[Start with the Introduction →](introduction.md)
