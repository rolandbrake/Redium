# Examples

Run `npm.cmd run dev` on Windows (`npm run dev` elsewhere), then open the
server address printed in the terminal. Select a page by changing the script
path in `index.html`, for example:

```html
<script type="module" src="/example/counter.ts"></script>
```

- `counter.ts`: state, a derived value, buttons, and nested composition.
- `states.ts`: a small cookie counter using state and a selector.
- `rows.ts`: nested rows and grid tiles.
- `container.ts`, `row.ts`, `column.ts`, `grid.ts`: layout studies.
- `layout.ts`: a responsive dashboard.
- `containers.ts`: pricing cards and a selection counter.
- `clock.ts`: a runnable mount, unmount, and disposal demonstration.
- `control-flow.ts`: runnable conditional and keyed-list examples.
- `stack.ts`: layered content and disposable dialog examples.
- `store.ts`: shared application state, actions, and selected values.
- `style.ts`: reusable styles and generated class reuse.

State remembers a value. A selector derives another value from it. Passing either
to Text keeps the text updated. Resize the browser to explore the layouts.
