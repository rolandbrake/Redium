# API Reference

## Core

- `Node` — hierarchy and framework event base class
- `Element` — DOM-backed base class
- `Root` — fullscreen application root
- `mountElement(view, target?)` — create and mount a view, from `redium/render`

## State

- `State<T>` — reactive value
- `state`, `createState` — state factories
- `selector`, `createSelector` — derived state factories
- `effect`, `createEffect` — reactive side effects

## Components and layout

- `Container`, `Text`, `Button`
- `Row`, `Column`, `Center`, `Grid`

`Container` is a responsive vertical flex container by default. `Row` is a
responsive horizontal container and wraps by default; `Column` is a vertical
non-wrapping convenience container. `Grid` uses CSS Grid with responsive
columns when `minColumnWidth` is provided.

## Styling and sizing

- `Style`
- `Shadow(...)`, `Shadow.sm`, `Shadow.md`, `Shadow.lg`, `Shadow.xl`
- `Border(width, color, style?)`, `BorderStyle`
- `Align.start`, `Align.center`, `Align.end`, `Align.between`, `Align.around`
- `Unit.px(value)`, `Unit.ratio(value)`, `Unit.rem(value)` â€” explicit unit values
- `px(value)` — explicit pixel string
- `ratio(value)` — explicit relative percentage string
- `min(...)`, `max(...)`, `clamp(...)` — CSS sizing functions
- `Relative`, `Absolute`, `CSSFunction`, `SizeValue` — sizing types

## Utilities

- `Color`
- `Colors.white`, `Colors.black`, and the built-in color palette
- `rgb(...)`, `rgba(...)`, `hex(...)`

All public exports are re-exported from the package root:

```ts
import { Column, Style, createState } from "redium";
```

For larger applications, focused subpath imports are also available:

```ts
import { Root } from "redium/core";
import { mountElement } from "redium/render";
import { Button, Column, Text } from "redium/elements";
import { createState } from "redium/state";
import { Border, Shadow, Style } from "redium/style";
import { Colors } from "redium/colors";
```
