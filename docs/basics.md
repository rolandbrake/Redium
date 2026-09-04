# Basics

## Installation

```bash
npm install redium
```

Redium targets browser applications and works with TypeScript or modern JavaScript bundlers.

## Development server

When working in this repository, run the examples with Vite:

```bash
npm run dev
```

Vite transforms the TypeScript example and provides hot module reloading. A generic static server cannot serve `example/counter.ts` as a JavaScript module.

## First application

```ts
import { Button, Column, Root, Text, createState, mountElement } from "redium";

const clicks = createState(0);
const body = Column({
  gap: 16,
  padding: 24,
  children: [
    Text(clicks.map((value) => `Clicked ${value} times`)),
    Button("Click me", { onClick: () => clicks.value++ }),
  ],
});

mountElement(Root(body));
```

`mountElement` mounts an element into `document.body` by default. Pass a second DOM element to choose another target. `Root` fills the viewport with `width: 100vw` and `height: 100vh`, and owns the supplied body container.

For larger applications, the same APIs can be imported by category. `mountElement` belongs to `redium/render`, while `Root` belongs to `redium/core`:

```ts
import { Root } from "redium/core";
import { mountElement } from "redium/render";
import { Column, Text } from "redium/elements";
```

## Fluent styles

```ts
import { Shadow } from "redium/style";

const panel = Column({ padding: 24 });
panel.style.background("white").radius(12).shadow(Shadow.md);
```

[Next: Elements →](elements.md)
