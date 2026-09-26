# API Reference

## Core

- `Node` - hierarchy base class
- `Element` - DOM-backed base class
- `Root` - fullscreen application root
- `mountElement(view, target?)` - create and mount a view, from `redium/render`
- `ElementOptions.onMount` - mount setup with returned unmount cleanup; see
  [Lifecycle](lifecycle.md)
- `ElementOptions.onDispose` - final one-time cleanup
- `element.unmount()` / `element.dispose()` - reversible detach / terminal cleanup

## State

- `State<T>` - reactive value
- `createState` - state factory
- `createSelector` - derived state factory

## Store

- `Store<T>` / `createStore(initial)` - explicit application state container
- `getState`, `setState`, `updateState`, `selectState`, `subscribeState` -
  verbal store operations; see [Store](store.md)
- `redium/store` - focused store entry point

## Control Flow

- `If(condition, whenTrue, whenFalse?)` - mount one lazy conditional branch
- `For(items, render, { key })` - render a keyed reactive array; see
  [Control Flow](control-flow.md)
- `redium/control` - focused control-flow entry point

## Components and layout

- `Container`, `Text`, `Button`, `Canvas`
- `Row`, `Column`, `Center`, `Grid`, `Stack`

`Stack` layers children and provides `push`, `pop`, `peek`, and `clear`; see
[Stack](stack.md).

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
- `px(value)` - explicit pixel string
- `ratio(value)` - explicit relative percentage string
- `min(...)`, `max(...)`, `clamp(...)` - CSS sizing functions
- `Relative`, `Absolute`, `CSSFunction`, `SizeValue` - sizing types

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
