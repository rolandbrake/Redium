# Introduction

Redium is an early-stage UI library for building reactive browser interfaces with TypeScript and ordinary functions instead of JSX.

## Core ideas

- Components are functions that return `Element` objects.
- Containers own child elements and map directly to DOM nodes.
- State is explicit through `State<T>`.
- Styles are small, reusable objects that apply directly to DOM elements.
- Layout uses familiar primitives such as rows, columns, and grids.

Redium has no virtual DOM requirement for its basic rendering path. Updating a `State` notifies only the consumers subscribed to it.

## Project status

Redium is pre-1.0. APIs may change while the architecture settles, so it is currently best suited for experiments, prototypes, learning, and contributors.

[Next: Basics →](basics.md)
