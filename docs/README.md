# Redium Documentation

Redium is a small, declarative, TypeScript-first UI library. Components are ordinary functions that return DOM-backed elements, and state is explicit and reactive.

## Sections

1. [Introduction](introduction.md) — concepts and project status
2. [Basics](basics.md) — installation, mounting, and a first application
3. [Elements](elements.md) — components and element hierarchy
4. [State](state.md) — reactive values, selectors, and effects
5. [Styling](styling.md) — reusable styles and DOM events
6. [Units](units.md) — dimensions, pixels, fonts, and CSS functions
7. [Layout](layout.md) — rows, columns, grids, and responsive widths
8. [API Reference](api.md) — public exports

## Quick start

```ts
import { Button, Column, Root, Text, state, mountElement } from "redium";

const count = state(0);
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
