# Store

A Redium `Store` is an explicit application-state container. It uses the same
reactivity as `State`, but adds named whole-store operations and selective reads.

Stores replace Context and Provider patterns for ordinary shared client state:
create a store in an application module, export it, and import it wherever it
is needed. Redium does not create a hidden global singleton.

```ts
import { createStore } from "redium";

export const appStore = createStore({
  theme: "light" as "light" | "dark",
  sidebarOpen: false,
});
```

The focused entry point is also available:

```ts
import { createStore } from "redium/store";
```

## Verbal store operations

```ts
const state = appStore.getState();

appStore.setState({
  theme: "dark",
  sidebarOpen: false,
});

appStore.updateState((current) => ({
  ...current,
  sidebarOpen: !current.sidebarOpen,
}));
```

- `getState()` reads the current whole state.
- `setState(next)` replaces the whole state. It does not shallow-merge objects.
- `updateState(updater)` reads the current state and replaces it with the
  updater result.
- `subscribeState(listener)` observes whole-state changes and returns an
  unsubscribe function.
- `selectState(selector)` creates reactive state for one selected value.

`setState` and `updateState` return the store itself, so they can be chained when
that improves readability.

## Select only what a view needs

Use `selectState` to keep a view connected to a small value rather than the
whole store:

```ts
const theme = appStore.selectState((state) => state.theme);
const sidebarOpen = appStore.selectState((state) => state.sidebarOpen);

Text(theme);
```

The result is a normal `State`. It works with `Text`, `Button`, `If`, `For`,
`createSelector`, and lifecycle callbacks.

```ts
const message = appStore.selectState((state) =>
  state.sidebarOpen ? "Sidebar open" : "Sidebar closed",
);

Text(message);
```

A selected state notifies its consumers only when its selected value changes
according to `Object.is`. Updating `sidebarOpen` does not notify a consumer of
the selected `theme` value.

## Immutable updates

Store updates should return a new array or object when changing structured data:

```ts
appStore.updateState((state) => ({
  ...state,
  user: {
    ...state.user,
    name: "Ali",
  },
}));
```

Do not mutate the current object and return it:

```ts
// Avoid: Object.is sees the same outer object, so no update is published.
appStore.updateState((state) => {
  state.sidebarOpen = true;
  return state;
});
```

## Actions belong beside the store

Keep application behavior in ordinary TypeScript functions. This is simpler
than a special action DSL and keeps actions easy to test.

```ts
export const actions = {
  toggleTheme() {
    appStore.updateState((state) => ({
      ...state,
      theme: state.theme === "light" ? "dark" : "light",
    }));
  },
};
```

Components import an action directly:

```ts
Button("Toggle theme", { onClick: actions.toggleTheme });
```

## Themes

A store is a good home for the active theme and other application-wide choices:

```ts
const theme = appStore.selectState((state) => state.theme);

If(
  theme.map((value) => value === "dark"),
  () => DarkPanel(),
  () => LightPanel(),
);
```

Current Redium style values such as `background` and `color` are plain values.
Changing a theme store does not yet automatically rewrite every style property.
Reactive style values should be added later as a separate, deliberate feature.

## Store scope

Each `createStore` call creates an independent store:

```ts
const appStore = createStore({ count: 0 });
const previewStore = createStore({ count: 0 });
```

For a browser application, exporting one module-scoped store gives shared global
state. For isolated tests, previews, or future server rendering, create and pass
the appropriate store instance instead of relying on a process-wide singleton.

See the runnable [`store.ts`](../example/store.ts) example.

[Next: Styling](styling.md)
