# Control Flow

Control-flow elements create, replace, reorder, and dispose child branches in
response to reactive state. They fit inside ordinary `children` arrays and use
the same lifecycle rules as every other Redium element.

```ts
import { For, If } from "redium";
```

They are also available from `redium/control`.

The first control-flow primitives are `If` for one conditional branch and `For`
for a keyed list.

## `If`

`If` watches a `State<boolean>`. It calls only the factory for the active branch.

```ts
function Dashboard() {
  const visible = createState(false);

  return Column({
    children: [
      Button("Toggle", {
        onClick: () => visible.value = !visible.value,
      }),
      If(
        visible,
        () => Text("First text"),
        () => Text("Second text"),
      ),
    ],
  });
}
```

The third callback is optional:

```ts
If(visible, () => SettingsPanel());
```

When `visible` is false in this version, there is no displayed child.

### Branch lifetime

`If` is lazy: no branch is created until its condition is first observed while
the `If` is mounted. On every condition change, it disposes the previous branch
and creates and mounts the newly selected branch.

```text
false -> true:  dispose false branch, create true branch
true  -> false: dispose true branch, create false branch
```

This deliberately gives React-like conditional behavior. State created inside a
branch factory is fresh each time that branch becomes active. Put state above
the `If` when it should survive a branch change:

```ts
const draft = createState("");

If(open, () => Editor(draft));
```

When the `If` itself unmounts, it stops observing its condition and unmounts its
current branch. Remounting preserves that current branch until the condition
changes. Disposing the `If` disposes its active branch too.

## `For`

`For` renders a reactive array. Each item needs an explicit stable application
key so Redium can preserve the correct element when items are reordered,
inserted, updated, or removed.

```ts
const users = createState(["Ali", "Sara", "John"]);

const list = For(
  users,
  (user) => Text(user),
  { key: (user) => user },
);
```

The item supplied to `render` is a `State<T>`, not a fixed snapshot. For a list
of strings, `Text(user)` works directly. `For` updates that item state whenever
the corresponding keyed array item changes.

`render` also receives a reactive index as its second argument:

```ts
For(
  users,
  (user, index) => Text(createSelector(() => `${index.value + 1}. ${user.value}`)),
  { key: (user) => user },
);
```

### Object items

For object lists, use an application identifier as the key and derive displayed
text from the item state:

```ts
type User = { id: string; name: string };

const users = createState<User[]>([
  { id: "ali", name: "Ali" },
  { id: "sara", name: "Sara" },
]);

For(
  users,
  (user) => Text(createSelector(() => user.value.name)),
  { key: (user) => user.id },
);
```

The key is not written as a DOM `id`. A DOM `id` must be globally unique and is
for document semantics; a `For` key is private list identity used for correct
reconciliation.

### Key behavior

Keys must be unique strings or finite numbers within one `For`. Duplicate,
missing, or invalid keys throw an error rather than silently associating the
wrong view with data.

When `users.value` changes:

- A new key creates and mounts a new branch.
- An existing key keeps its element and local branch state; its item and index
  `State` values are updated.
- A moved key keeps its DOM and element identity while Redium changes its order.
- A removed key disposes its branch.

Use immutable array updates so `State` can observe them:

```ts
users.value = [...users.value, { id: "john", name: "John" }];
users.value = users.value.filter((user) => user.id !== "ali");
```

## Lifecycle and visibility

Both `If` and `For` observe their source state only while mounted. If a parent
temporarily unmounts, their subscriptions stop along with the child branches.
Remounting reads the latest condition or array and brings the correct branches
back to life.

This keeps control flow aligned with the [Lifecycle guide](lifecycle.md): a
removed branch releases its timers, listeners, requests, and reactive DOM
bindings through normal disposal.

## Current scope

`If` always disposes an inactive branch. `For` is keyed and always disposes a
removed item. Future additions may include preserved branches (`keepAlive`),
loading/error helpers, and asynchronous resources, but they should build on the
same ownership rules rather than introduce a second rendering model.

See the runnable [`control.ts`](../example/control.ts) example.

[Next: State](state.md)
