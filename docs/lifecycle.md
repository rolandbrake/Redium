# Lifecycle

Redium elements are ordinary objects with a small, explicit lifetime. An element
can be created before it is visible, mounted into a live element tree, unmounted
for later reuse, or permanently disposed.

Lifecycle is designed for work that belongs to a visible element: timers,
browser event listeners, network requests, observers, and reactive DOM bindings.
It is not a rerender system. A state update changes the bindings that read that
state; it does not recreate the component or call an update lifecycle callback.

## The element lifetime

```text
created -- mount --> mounted
   ^                    │
   |-----unmount -------|

            │
         dispose
            v
         disposed
```

- **Created**: the element exists and may have children, but is not live in the
  browser DOM.
- **Mounted**: the element belongs to a mounted tree. Its mount callbacks and
  reactive DOM bindings are active.
- **Unmounted**: the element is detached from the live tree. It is reusable,
  but its mount-scoped work has stopped.
- **Disposed**: the element has finished permanently. It cannot be mounted,
  added to a parent, or unmounted again.

An element starts in the created/unmounted state. `mountElement` mounts a root
element into a browser target. Adding an element under an already mounted parent
mounts it automatically.

## `onMount`

Pass `onMount` in any element's options. It runs every time that element becomes
mounted. Return a cleanup function for work that must stop when the element
unmounts.

```ts
function Clock() {
  const seconds = createState(0);
  const label = createSelector(() => `${seconds.value}s elapsed`);

  return Column({
    gap: 12,
    children: [Text("Clock"), Text(label)],
    onMount: () => {
      const timer = window.setInterval(() => seconds.value++, 1_000);
      return () => window.clearInterval(timer);
    },
  });
}
```

The timer starts when the clock becomes visible and stops when the clock is
removed or unmounted. Remounting the same clock starts a new timer while
preserving its `seconds` state.

`onMount` is available on every `Element` option type, including `Container`,
`Row`, `Column`, `Grid`, `Center`, `Text`, and `Button`.

### Setup and cleanup stay together

The returned function is Redium's unmount behavior. Keeping setup and cleanup
together makes it clear which resource is being released.

```ts
const panel = Column({
  children: [Text("Press Escape to close")],
  onMount: () => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") panel.unmount();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  },
});
```

There is deliberately no separate `onUnmount` option. A cleanup returned by
`onMount` is the paired, local, and sufficient unmount behavior.

### Adding setup after mount

The chainable API is useful when a helper needs to attach lifecycle work after
an element was created:

```ts
const panel = Column({ children: [Text("Loading…")] });

panel.onMount(() => {
  const observer = new ResizeObserver(() => console.log("resized"));
  observer.observe(document.body);
  return () => observer.disconnect();
});
```

If `panel` is already mounted, this setup runs immediately. Otherwise it runs
at the next mount. Multiple `onMount` method calls are independent; each cleanup
runs on unmount.

## `onDispose`

`onDispose` is for a resource owned by the element that must be released once,
not restarted whenever the element becomes visible again.

```ts
function ImagePreview(url: string) {
  return Text("Image preview", {
    onDispose: () => URL.revokeObjectURL(url),
  });
}
```

Most elements only need `onMount` and its returned cleanup. Use `onDispose`
sparingly: it is for terminal ownership, such as revoking an object URL or
releasing an element-owned cache entry.

The method equivalent is `element.onDispose(cleanup)`. It is mainly useful for
composition and library helpers.

## Unmounting, removing, and disposal

Use `unmount()` when the same element may return later:

```ts
const settings = SettingsPanel();

settings.unmount(); // Stops mount work and detaches from its parent.
content.add(settings); // Reuses and mounts the same element again.
```

Removing a direct child with `parent.remove(child)` has the same temporary
detach behavior. Moving an element to another parent also unmounts it from the
old parent and mounts it under the new one when that new parent is mounted.

Use `dispose()` only when the element will never be reused:

```ts
preview.dispose();
```

Disposal first unmounts active work, then disposes descendants, then runs the
element's `onDispose` callbacks. Calling `dispose()` again is harmless, but any
attempt to mount, add, or unmount a disposed element throws a clear error.

## Reactive bindings while hidden

Reactive content is live only while its element is mounted:

```ts
const count = createState(0);
const label = Text(count);

parent.add(label); // If parent is mounted, label subscribes to count.
label.unmount();
count.value = 1; // The detached label does not update yet.
parent.add(label); // It remounts and immediately displays "1".
```

This prevents detached elements from retaining active subscriptions. The state
itself is not disposed: it remains an ordinary value that can be shared with
other mounted elements.

## Tree ordering

Lifecycle follows ownership through the element tree:

1. Mounting runs a parent's `onMount` setup before mounting its children.
2. Unmounting runs children first, in reverse child order, then runs the
   parent's mount cleanups in reverse registration order.
3. Disposal follows the same child-first order. Each child is disposed before
   the parent's `onDispose` callbacks run.

This means a parent can safely release something that its descendants depended
on only after those descendants have already stopped using it.

## Async work

Treat an in-flight request as mount-scoped work. Abort it during cleanup so a
hidden view does not continue a request that no longer matters.

```ts
function Profile(userId: string) {
  const status = createState("Loading profile…");

  return Column({
    children: [Text(status)],
    onMount: () => {
      const request = new AbortController();

      fetch(`/api/users/${userId}`, { signal: request.signal })
        .then((response) => response.json())
        .then((user) => status.value = user.name)
        .catch((error) => {
          if (error.name !== "AbortError") status.value = "Could not load profile";
        });

      return () => request.abort();
    },
  });
}
```

## Practical guidance

- Put work that should exist only while visible in `onMount`.
- Always return cleanup for timers, browser listeners, observers, subscriptions,
  and cancellable requests.
- Keep application state outside the lifecycle when it should survive hiding a
  view. Pass that state into the view explicitly.
- Prefer `unmount` for temporary UI such as tabs, panels, and overlays.
- Prefer `dispose` for removed list items or resources that must never return.
- Do not use lifecycle callbacks to copy one state into another. Use
  `createSelector` for derived values.
- Avoid `onUpdate`; Redium updates state-backed DOM bindings directly.

See the runnable [`clock.ts`](../example/clock.ts) example and the additional
[lifecycle patterns](../example/lifecycle.proposal.md).

[Next: State](state.md)
