<p align="center">
  <img src="crystal.png" alt="Redium crystal" width="360" />
</p>


# Redium

> A small, declarative, JavaScript-first UI library for building reactive interfaces with TypeScript.

Redium is an early-stage experiment in making UI development feel direct and readable. It uses ordinary TypeScript functions instead of JSX, keeps state explicit, and maps a small component API to real DOM elements.


The project is intentionally incomplete. That is also the invitation: if you enjoy UI architecture, reactive systems, DOM APIs, or developer tooling, there is plenty of room to shape Redium with us.

## Why Redium?

Redium aims to offer a lightweight alternative for developers who want:

- Declarative component functions without a JSX transform
- Explicit, easy-to-follow reactive state
- TypeScript-first APIs
- Composable layout primitives
- A small styling layer that stays close to CSS
- No virtual DOM requirement for the basic rendering path
- A codebase small enough to understand and improve

## Current status

Redium is pre-1.0 and under active development. The core primitives work, but APIs may change while the architecture settles. It is best suited for experiments, prototypes, learning, and contributors interested in helping define the library's direction.

See the [documentation](docs/README.md) for the getting-started guide and [unit reference](docs/units.md).

## Building the package

```bash
npm run dev
npm run typecheck
npm run build
```

Use `npm run dev` to serve the example application with Vite and HMR. Do not open `index.html` through a static server that does not transform TypeScript. The production build creates bundled ESM and CommonJS files, source maps, and TypeScript declarations in `dist/`. Examples are excluded from the published package.

## Quick example

```ts
import {
  Button,
  Column,
  Row,
  Text,
  createSelector,
  createState,
  min,
  mountElement,
  Shadow,
  Colors,
} from "redium";

function Counter() {
  const count = createState(0);
  const doubled = createSelector(() => count.value * 2);

  return Column({
    gap: 16,
    padding: [24, 32],
    style: {
      width: min(1, 384),
      background: Colors.white,
      radius: 16,
      shadow: Shadow.md,
    },
    children: [
      Text(count, { style: { font: 48, weight: 700 } }),
      Text(doubled.map((value) => `Double: ${value}`)),
      Row({
        gap: 8,
        center: true,
        children: [
          Button("-", { onClick: () => count.value-- }),
          Button("Reset", { onClick: () => (count.value = 0) }),
          Button("+", { onClick: () => count.value++ }),
        ],
      }),
    ],
  });
}

mountElement(Counter);
```

State updates automatically notify subscribers, and `Text` can render a state directly. Derived values are created with `createSelector`.

## Features

### Reactive state

```ts
const name = createState("Ada");
const greeting = createSelector(() => `Hello, ${name.value}!`);

Text(greeting);
name.value = "Grace";
```

Available state utilities include `State`, `createState`, `createSelector`, `createEffect`, and `effect`.

### Declarative components

Components are ordinary functions that return an element:

```ts
function Welcome() {
  return Column({
    gap: 8,
    children: [
      Text("Welcome", { style: { font: 28, weight: 700 } }),
      Text("A component can be composed from other components."),
    ],
  });
}
```

### Layout primitives

- `Container` - flexible base container
- `Column` - vertical layout
- `Row` - horizontal layout
- `Grid` - grid layout with responsive columns
- `Center` - centers one child

```ts
Grid({
  columns: 3,
  minColumnWidth: 220,
  gap: 16,
  children: cards,
});
```

### Styling close to CSS

Styles can be supplied with an element or applied through the chainable `Style` API:

```ts
const panel = Column({
  padding: [24, 16], // top/bottom: 24px, left/right: 16px
  margin: 12,
  style: {
    width: min(1, 512),
    background: "#fff",
    radius: 12,
    shadow: Shadow.lg,
    weight: 600,
  },
});

panel.style
  .width(400)
  .padding([24, 16, 32, 16])
  .background("#ffffff");
```

Numeric sizes are interpreted as pixels, except for values from `0` through `1`, which represent a ratio of the parent dimension. Raw CSS strings are not accepted by the sizing API; use the framework sizing helpers instead.

### DOM events and element behavior

```ts
Button("Save", {
  onClick: () => console.log("saved"),
  disabled: isSaving,
});
```

Elements expose useful DOM-oriented methods such as `mount`, `unmount`, `attr`, `show`, `hide`, and event helpers like `onClick`, `onHover`, and `onFocus`.

### Color and sizing helpers

Redium includes small helpers for common CSS values:

```ts
import { clamp, hex, min, rgba } from "redium";

const accent = hex("#38bdf8");
const translucent = rgba(15, 23, 42, 0.8);
const width = clamp(240, 0.5, 720);
const cardWidth = min(1, 420);
```

## Running the example

Clone the repository and install the development dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/redium.git
cd redium
npm install
npm run build
```

The example entry point is `example/counter.ts`. After building, serve the repository with any static HTTP server and open `index.html` in a browser. For example, if you have Python installed:

```bash
python -m http.server
```

Then visit `http://localhost:8000`.

The demo uses a browser import map in `index.html` to map the package-style import `"redium"` to the local `dist/index.js` build. In an application using a bundler or a package manager, the `redium` import is resolved through the package's `exports` field instead.

Useful commands:

```bash
npm run typecheck  # Check TypeScript without emitting files
npm run build      # Compile src and example into dist/
```

## Project structure

```text
src/
  core/       Element and node foundations
  elements/   Text, Button, and Container
  layout/     Row, Column, Grid, and Center
  render/     DOM mounting
  state/      State, selectors, and effects
  style/      Style and size helpers
  utils/      Color utilities
example/      Small runnable examples
```

## Where help is welcome

The most useful contributions are improvements that make the core easier to use without making it harder to understand. Good starting points include:

- Adding focused tests for state, rendering, layout, and styles
- Improving accessibility defaults and keyboard behavior
- Designing better component and lifecycle APIs
- Improving responsive layout behavior
- Adding documentation and small examples
- Improving error messages and TypeScript types
- Measuring and improving rendering performance
- Creating a lightweight development workflow and demo site

Please open an issue before making a large architectural change. For smaller fixes, a pull request with a clear description and a typecheck/build result is welcome.

## Roadmap ideas

These are ideas, not promises, and community feedback should influence their priority:

- A test suite and browser-based test harness
- More accessible primitives and focus management
- Better list rendering and keyed updates
- More complete lifecycle and cleanup behavior
- Forms and controlled inputs
- Routing and application-level state patterns
- Server rendering or hydration experiments
- Published packages and versioned API documentation

## Contributing

1. Fork the repository and create a focused branch.
2. Make the smallest change that solves the problem.
3. Add or update an example when changing public behavior.
4. Run `npm run typecheck` and `npm run build`.
5. Open a pull request describing the problem, the solution, and any trade-offs.

If you are unsure where to begin, open a discussion or issue with an idea, question, or small experiment. Early feedback is especially valuable while Redium is still taking shape.

## License

No license has been selected yet. Add a license before publishing Redium for external use so contributors and users know how the code may be used.
