# Unit Standardization

Redium uses pixels for whole-number dimensions and ratios for fractional dimensions. Use the `ratio` helper when a whole-number ratio is needed.

## Relative-capable dimensions

Explicit unit helpers are available when you want to make the unit visible in the code:

```ts
import { Unit, ratio } from "redium/style";

Container({ width: Unit.ratio(0.5), maxWidth: Unit.px(640) });
Text("Readable size", { style: { width: Unit.rem(20) } });
```

Bare fractional numbers remain a shorthand for relative dimensions.

For `width`, `height`, `minWidth`, `maxWidth`, `minHeight`, and `maxHeight`:

| Value | CSS meaning |
| --- | --- |
| `0` | `0px` |
| `0.5` | `50%` of the parent |
| `1` | `1px` |
| `16` | `16px` |
| `100` | `100px` |

Non-integer values must be within `0..1` and become parent ratios. Whole numbers are pixels. Use `ratio(1)` or `Unit.ratio(1)` for `100%`. Negative dimension values are rejected. Raw CSS strings are not accepted by the sizing API; use the framework helpers to construct sizing expressions.

```ts
Container({ width: 0.8, maxWidth: 720 });
Container({ width: ratio(1) });
```

## Absolute-only values

These properties always use logical CSS pixels:

```ts
import { Border, Style } from "redium/style";

new Style({
  gap: 16,
  radius: 8,
  padding: 24,
});

new Style({ border: Border(1, "#ddd") });
```

Explicit absolute units can be used for these properties as well:

```ts
import { Unit } from "redium/style";

new Style({
  gap: Unit.px(16),
  radius: Unit.rem(0.5),
  padding: [Unit.px(12), Unit.px(20)],
});
```

Relative units such as `Unit.ratio(0.5)` are rejected for spacing properties.
Use ratios only where the property describes a dimension relative to its parent.

`gap: 0` means `0px`; it is never treated as a relative value. Negative padding, gap, radius, and border widths are rejected. Negative margins are allowed because CSS supports them.

## Font size and opacity

Font sizes are always absolute and are converted from a 16px logical baseline to `rem`:

```ts
new Style().font(14); // font-size: 0.875rem
```

Opacity is always a relative fraction from `0..1`:

```ts
new Style().opacity(0.75); // opacity: 0.75
```

Values outside the supported ranges, non-finite numbers, and invalid negative dimensions throw an error early.

## CSS sizing functions

Use `min`, `max`, and `clamp` to combine framework values. Whole-number arguments are pixels; fractional arguments are ratios:

```ts
const width = min(0.9, 640);
// min(90%, 640px)

const fluid = clamp(320, 0.8, 960);
// clamp(320px, 80%, 960px)

Container({ width: fluid });
```

Because TypeScript represents both `Relative` and `Absolute` as `number`, their semantic meaning cannot be distinguished at compile time. Runtime conversion uses whether the number is fractional; use `ratio` where the intent needs to be explicit.

For APIs where the unit should be explicit, use the `Unit` helpers:

```ts
Unit.px(16);       // 16px
Unit.ratio(0.5);   // 50%
Unit.rem(1);       // 1rem
```
