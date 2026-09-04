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

Use `raw(property, value)` only for a CSS property without a Redium convenience method.

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

## Events and DOM access

```ts
const button = Button("Open");
button.onClick(() => console.log("opened"));
button.onHover((hovering) => console.log(hovering));
button.attr("aria-label", "Open details");
button.mount(document.body);
```

Every element exposes its underlying `dom` node and reactive `style`. `mount`, `unmount`, `show`, and `hide` are available on all elements.

[Next: Units →](units.md)
