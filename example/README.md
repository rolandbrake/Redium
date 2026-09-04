# Layout behavior studies

Each file is a standalone page intended for experimenting with one layout primitive:

- `container-study.ts` - default vertical layout, row mode, nesting, widths, and wrapping
- `grid-study.ts` - fixed columns, gaps, equal tracks, and responsive `minColumnWidth`
- `row-study.ts` - horizontal sizing, gap-aware ratios, and optional wrapping
- `column-study.ts` - vertical ordering, spacing, nested content, and centering
- `rows.ts` - the existing grid tile example

Run the development server with `npm run dev`, then change the script path in `index.html` to the file you want to study. For example:

```html
<script type="module" src="/example/row-study.ts"></script>
```

Resize the browser while studying the examples. This makes the responsive behavior and the difference between wrapped and non-wrapped rows visible.
