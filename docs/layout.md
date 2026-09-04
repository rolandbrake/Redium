# Layout

Layout components are part of the `redium/elements` entry point. There is no separate `redium/layout` import path.

## Rows, columns, and centering

```ts
Row({ children: [Text("Left"), Text("Right")] });
Column({ children: [Text("Top"), Text("Bottom")] });
Center(Text("Centered"));
```

`Row` is horizontal, `Column` is vertical, and both disable wrapping by default. `Center` accepts one child and centers it without changing the child's own layout.

## Grid

```ts
Grid({
  columns: 3,
  gap: 16,
  children: [Text("One"), Text("Two"), Text("Three")],
});
```

Set `rows` for explicit rows. With `wrap: true` and `minColumnWidth`, the grid uses responsive `auto-fit` columns.

## Responsive widths

```ts
Row({
  wrap: true,
  gap: 16,
  children: [Container({ width: 0.5 }), Container({ width: 0.5 })],
});
```

When relative-width children wrap onto another line, Redium expands the wrapped children to the available row width.

[Back to documentation index ←](README.md)
