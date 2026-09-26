<p align="center">
  <a target="_blank" href="https://rediumjs.netlify.app/">
    <img src="crystal.png" alt="Redium crystal" width="100%"/>
  </a>
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

## Development and builds

```bash
npm run dev
npm run typecheck
npm run build
npm run build:library
npm test
```

`npm run dev` starts the Redium development server for the application selected by `index.html`. `npm run build` creates its minified browser bundle, HTML, and imported assets in `dist/`. Do not open `index.html` through a static server that does not transform TypeScript.

`npm run build:library` creates Redium's publishable ESM and CommonJS files, source maps, and TypeScript declarations in `dist/`. `npm test` runs that package build and the behavioral contract tests. See [building applications](docs/build.md) for using `npx redium dev` and `npx redium build` in an application project.

The root import (`redium`) and subpath imports (such as `redium/state` and
`redium/elements`) share runtime identities within each module format. ESM uses
shared chunks; CommonJS subpaths re-export one runtime bundle. Keep the complete
`dist/` directory when distributing the package, including its `chunks/` folder.
ESM and CommonJS are separate runtimes: use one format consistently when passing
Redium states, styles, and elements between modules.

## Quick example

```ts
import {
  Root,
  Button,
  Column,
  Row,
  Text,
  createState,
  min,
  ratio,
  mountElement,
  Shadow,
  Colors,
  Center,
} from "redium";

const Counter = () => {
  const count = createState(0);

  return Center(
    Column({
      gap: 16,
      padding: [24, 32],
      style: {
        width: min(ratio(1), 384),
        background: Colors.white,
        radius: 16,
        shadow: Shadow.md,
      },
      children: [
        Center(Text(count, { style: { font: 48, weight: 700 } })),
        Row({
          gap: 8,
          center: true,
          children: [
            Button("-", { onClick: () => count.value-- }),
            Button("Reset", { onClick: () => (count.value = 0) }),
            Button("+", { onClick: () => count.value++ }),
          ],
        }), // Row
      ],
    }), // Column
  ); // Center
};

mountElement(
  Root(Counter(), {
    style: { background: Colors.gray },
  }),
);

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

State utilities include `State`, `createState`, and `createSelector`.

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

- `Container` - responsive vertical flex container; use `row: true` for low-level horizontal layout
- `Column` - vertical flex layout
- `Row` - responsive horizontal flex layout that wraps by default
- `Grid` - independent CSS Grid layout with responsive columns
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
    width: min(ratio(1), 512),
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

Whole-number sizes are pixels. Fractional values from `0` through `1` represent a ratio of the parent dimension; use `ratio(1)` for `100%`. Raw CSS strings are not accepted by the sizing or spacing APIs; use the library sizing helpers instead.

Use `grow` and `shrink` to control flex space distribution:

```ts
Row({
  children: [
    Container({ grow: 1, children: [Text("Flexible content")] }),
    Container({ width: 220, shrink: 0, children: [Text("Fixed panel")] }),
  ],
});
```

### DOM events and element behavior

```ts
Button("Save", {
  onClick: () => console.log("saved"),
  disabled: isSaving,
});
```

Elements support mounting, temporary unmounting, and semantic click handlers. Page code uses Redium components and typed styles; browser implementation details stay inside the library.

### Color and sizing helpers

Redium includes small helpers for common CSS values:

```ts
import { clamp, hex, min, ratio, rgba } from "redium";

const accent = hex("#38bdf8");
const translucent = rgba(15, 23, 42, 0.8);
const width = clamp(240, 0.5, 720);
const cardWidth = min(ratio(1), 420);
```

## Running the example

Clone the repository and install the development dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/redium.git
cd redium
npm install
npm run dev
```

Vite transforms the TypeScript examples and resolves the local `redium` package aliases. The default page loads `example/row.ts`; change the script path in `index.html` to study another example. Static servers cannot load these TypeScript modules directly.

The package exports focused entry points for larger applications:

```ts
import { Root } from "redium/core";
import { mountElement } from "redium/render";
import { Column, Text } from "redium/elements";
import { Unit } from "redium/style";
```

Useful commands:

```bash
npm run typecheck  # Check TypeScript without emitting files
npm run build:library # Bundle the library and generate declarations
npm test           # Build and run behavioral contract tests
```

## Project structure

```text
src/
  core/       Element, node, and root foundations
  elements/   Container, Text, Button, Row, Column, Grid, and Center
  render/     DOM mounting
  state/      State, selectors, and effects
  style/      Style, units, borders, shadows, and sizing helpers
  utils/      Color utilities
example/      Runnable demos and behavior studies
tests/        Behavioral contract tests
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

- A browser-based layout test harness
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
