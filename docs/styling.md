# Styling

## Style configuration

Pass a style configuration to any element or share a reusable `Style` instance:

```ts
import { Border, Shadow, Style, Text } from "redium";

const cardStyle = new Style({
  background: "white",
  color: "#222",
  radius: 12,
  padding: 20,
  shadow: Shadow.md,
  border: Border(1, "#e2e8f0"),
});

Text("Reusable style", { style: cardStyle });
```

Supported configuration includes dimensions, `background`, `color`, `radius`, `shadow`, `border`, `gap`, `opacity`, `cursor`, `font`, `weight`, `padding`, and `margin`. Use `Shadow.sm`, `Shadow.md`, `Shadow.lg`, or `Shadow.xl` for presets, or create a custom shadow:

```ts
const customShadow = Shadow(0, 4, 16, 0, "#0000001a");
new Style({ shadow: customShadow });
```

Custom borders use the `Border` creator. The style defaults to `BorderStyle.solid`:

```ts
import { Border, BorderStyle, Style } from "redium";

new Style({ border: Border(1, "#e2e8f0", BorderStyle.solid) });
```

Use the built-in palette instead of repeating common color strings:

```ts
import { Colors, Style } from "redium";

new Style({
  background: Colors.white,
  color: Colors.slate,
});
```

Alignment uses typed constants:

```ts
import { Align, Style } from "redium";

new Style().row(Align.center);
```

## Reusable appearance

A supplied Style remains a shared source of appearance. Each element keeps its
own layout defaults and local style changes:

```ts
const shared = new Style().color("black");
const row = Row({ style: shared });
const column = Column({ style: shared });
shared.color("green");   // Both update without changing their layouts.
row.style.color("blue"); // Only the row changes.
```

Local explicit styles take precedence over shared values, which take precedence
over component defaults. Keep page layout in Row, Column, Grid, and Center.

## Automatic CSS classes

Redium turns the fully resolved style for every element into a private,
deterministic CSS class. The class and stylesheet are managed internally: do
not name classes, write CSS, or attach a provider. Equal resolved styles share
one generated rule, including styles created by separate components.

This also applies to style changes at runtime. Calling a style method replaces
the element's private class with the class for its new resolved declarations;
Redium leaves any `className` you supplied untouched:

```ts
const panel = Column({ style: { background: "white" }, className: "marketing-panel" });

theme.subscribe((value) => {
  panel.style.background(value === "dark" ? "#172033" : "white");
});
```

The browser receives stylesheet rules rather than per-element inline styles.
The generated names are an implementation detail and must not be used by
application code. `redium build` evaluates the production entry once while
building, collects the constructed rules into a hashed CSS asset, and links
that file in the generated HTML. Lifecycle hooks are not run during this pass.
Rules introduced later by runtime state changes still fall back to Redium's
runtime stylesheet.

[Next: Units](units.md)
