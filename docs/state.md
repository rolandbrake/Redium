# State

## Creating state

`state`, `createState`, and `new State()` create a reactive value:

```ts
const name = state("Ada");
name.value = "Grace";
```

Assignments notify subscribers only when the value changes according to `Object.is`.

## Derived state

```ts
const greeting = selector(() => `Hello, ${name.value}!`);
Text(greeting);

const doubled = count.map((value) => value * 2);
```

Reading `name.value` while the selector runs tracks the dependency. `selector` returns a derived `State`.

## Effects and subscriptions

```ts
const stop = effect(() => {
  document.title = greeting.value;
});

const unsubscribe = count.subscribe((value) => console.log(value));
stop();
unsubscribe();
```

Subscriptions run immediately with the current value and return cleanup functions.

[Next: Styling →](styling.md)
