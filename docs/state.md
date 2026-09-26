# State

Create a value with `createState` or `new State`:

```ts
const count = createState(0);
count.value++;
```

Assignments notify subscribers only when the value changes according to Object.is.
Use a new array or object when changing structured data.

## Derived values

```ts
const message = createSelector(() => "Count: " + count.value);
Text(message);
const doubled = count.map((value) => value * 2);
```

Selectors evaluate once initially and track the states read during each synchronous
calculation. Conditional branches refresh those dependencies; inactive branches
stop triggering recomputation. Calculations should only read state and return values.

## Subscriptions

```ts
const unsubscribe = count.subscribe((value) => console.log(value));
unsubscribe();
```

Subscriptions receive the current value immediately. Text and Button handle their
own state bindings. Use `createState` and `createSelector` consistently.

[Next: Store](store.md)
