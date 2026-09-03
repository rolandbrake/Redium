Absolutely. Since you want everything we've discussed consolidated, I’d structure the Markdown as a **framework architecture/design document**, including the original API, declarative direction, component model, reactivity, `state()`, `computed()`, the Redux-like `store()`, rendering, lifecycle, async state, forms, routing, styling, and the proposed architecture.

I can’t attach a file directly from this chat, but here is the complete content you can save as `framework-architecture.md`:

# Custom UI Framework - Architecture & API Design

## 1. Vision

The goal is to build a lightweight, JavaScript-first UI framework that is:

* Readable
* Declarative
* Reactive
* Composable
* Performant
* Easy to learn
* Easy to debug
* Suitable for both small and large applications

The framework does **not** need to become another React.

The goal is:

> Build the simplest reactive UI framework that remains pleasant to use as an application grows.

The framework should allow developers to describe UI using ordinary JavaScript without requiring JSX.

---

# 2. Core Philosophy

The framework should have a simple mental model:

> **Components describe UI. State describes data. Computed values describe relationships. Stores manage shared application state. The renderer updates the DOM.**

A developer should be able to understand an application by looking at its component structure.

For example:

```js
function Counter() {
  const count = state(0);

  return Column({
    children: [
      Text(count),

      Button("+", {
        onClick: () => count.value++,
      }),
    ],
  });
}
```

The code clearly expresses:

1. There is a counter.
2. The counter has state.
3. The state is displayed.
4. Clicking the button changes the state.

---

# 3. Current API

The original API uses classes and imperative configuration:

```js
import {
  Root,
  Container,
  Text,
  Button,
  State,
  rgba,
  hex,
} from "../src/index.js";

const count = new State(0);

const label = new Text(count);

const increment = new Button("+").onClick(() => {
  count.value++;
});

const decrement = new Button("-").onClick(() => {
  count.value--;
});

const row = new Container({
  children: [decrement, increment],
  columns: 2,
  gap: 8,
});

const button = new Button("Click me");

button.style
  .width(200)
  .height(50)
  .radius(8)
  .background(hex("#222"))
  .color("white")
  .cursor("pointer");

button.style.when(button.hovering, (style) => {
  style.background("#444");
});

button.onClick(() => {
  button.text = "Clicked!";
});

const page = new Root({
  children: [button, label, row],
  columns: 1,
  gap: 24,
});

page.style.pad(48);

if (typeof document !== "undefined") {
  page.mount();
}
```

This API has several strengths:

* It is pure JavaScript.
* It does not require JSX.
* State is explicit.
* Styling is chainable.
* Events are easy to attach.
* Components can be composed.
* The code directly represents the UI.

---

# 4. Imperative vs Declarative

The original API is partly imperative.

For example:

```js
const button = new Button("Click me");

button.style
  .width(200)
  .height(50);

button.onClick(() => {
  button.text = "Clicked!";
});
```

This describes a sequence of actions:

1. Create the button.
2. Change its style.
3. Attach an event.
4. Mutate its text later.

A declarative API instead describes what the UI should be.

For example:

```js
Button("Save", {
  onClick: save,

  style: {
    width: 200,
    height: 50,
  },
});
```

This is easier to reason about because the component configuration contains most of the information about the component in one place.

---

# 5. Declarative API Direction

The proposed API is:

```js
import {
  Column,
  Row,
  Text,
  Button,
  state,
  computed,
  mount,
} from "../src/index.js";
```

Components become ordinary functions:

```js
export function Counter() {
  const count = state(0);

  return Column({
    children: [
      Text(count),

      Button("+", {
        onClick: () => count.value++,
      }),
    ],
  });
}
```

This creates a simple component model:

```text
Function
   ↓
UI description
   ↓
Renderer
   ↓
DOM
```

---

# 6. Recommended Component Syntax

A good target syntax is:

```js
export function Counter() {
  const count = state(0);

  const doubled = computed(
    () => count.value * 2
  );

  return Column({
    gap: 8,

    children: [
      Text(count),

      Text(doubled, {
        style: {
          color: "gray",
        },
      }),

      Row({
        gap: 8,

        children: [
          Button("-", {
            onClick: () => count.value--,
          }),

          Button("+", {
            onClick: () => count.value++,
          }),
        ],
      }),
    ],
  });
}
```

This is preferred over the older imperative version because the component's structure is immediately visible.

---

# 7. Application Structure

A complete application could look like:

```js
export function AppView() {
  return Column({
    padding: 48,
    gap: 24,

    children: [
      Button("Click me"),
      Counter(),
    ],
  });
}

const page = mount(AppView);

export { page };
```

The application hierarchy becomes easy to understand:

```text
AppView
├── Button
└── Counter
    ├── Text
    ├── Text
    └── Row
        ├── Button
        └── Button
```

---

# 8. Local State

The framework should provide a lightweight reactive primitive:

```js
const count = state(0);
```

A component can use it directly:

```js
function Counter() {
  const count = state(0);

  return Column({
    children: [
      Text(count),

      Button("+", {
        onClick: () => {
          count.value++;
        },
      }),
    ],
  });
}
```

The important rule is:

> `state()` should normally be used for state that belongs to one component or a small part of the UI.

---

# 9. Computed State

The framework should provide derived reactive values:

```js
const count = state(0);

const doubled = computed(
  () => count.value * 2
);
```

Then:

```js
Text(doubled);
```

should automatically update when `count` changes.

The dependency graph becomes:

```text
count
  │
  ▼
doubled
  │
  ▼
Text(doubled)
```

If `count` changes:

```js
count.value++;
```

the framework should only update the relevant parts of the UI.

---

# 10. Reactive Graph

The internal architecture could be:

```text
State
  │
  ▼
Reactive Graph
  │
  ▼
Computed Values
  │
  ▼
Components
  │
  ▼
Renderer
  │
  ▼
DOM
```

The framework should ideally use fine-grained reactivity.

For example:

```text
count changes
     │
     ▼
Text(count)
     │
     ▼
Update only this DOM node
```

It should avoid unnecessarily rerendering the entire application.

---

# 11. Components

Components should be ordinary functions.

Example:

```js
function UserMenu({ user }) {
  return Column({
    children: [
      Text(user.name),

      Button("Logout", {
        onClick: logout,
      }),
    ],
  });
}
```

Components can then be composed:

```js
function Dashboard() {
  return Column({
    children: [
      Header(),
      Sidebar(),
      Analytics(),
      UserMenu(),
    ],
  });
}
```

This is essential for large applications.

---

# 12. Component Composition

Large applications should be structured as a tree of small components.

Example:

```text
App
├── Dashboard
│   ├── Header
│   ├── Sidebar
│   ├── Notifications
│   ├── UserMenu
│   └── Analytics
│       ├── Chart
│       ├── Filters
│       └── DataTable
├── Settings
├── Billing
└── Admin
```

The framework should make this structure natural.

---

# 13. Why Large Applications Are Difficult

There is nothing inherently wrong with using a custom framework for large applications.

The real challenge is **UI complexity**, not line count.

Large applications typically have:

* Many components
* Shared state
* Derived state
* Async operations
* Forms
* Routing
* Permissions
* Authentication
* Notifications
* Loading states
* Error states
* Caching
* Performance requirements
* Lifecycle management
* Testing requirements

The framework must provide clear solutions for these problems.

---

# 14. State Management Strategy

The framework should support multiple levels of state.

The three main primitives could be:

```js
state()
computed()
store()
```

### Local state

```js
const count = state(0);
```

### Derived state

```js
const doubled = computed(
  () => count.value * 2
);
```

### Shared application state

```js
const auth = store({
  user: null,
  loading: false,
});
```

The mental model becomes:

> **State is local. Store is shared. Computed derives values.**

---

# 15. Redux-Like Store

A Redux-like store can be added for shared application state.

Example:

```js
const app = store({
  user: null,
  theme: "dark",
  sidebarOpen: true,
  notifications: [],
});
```

The store should be intended for state shared by multiple parts of the application.

Examples:

* Authentication
* Current user
* Theme
* Application settings
* Shopping cart
* Notifications
* Permissions
* Selected project
* Global filters

---

# 16. Store Actions

Rather than forcing developers to use traditional Redux reducers everywhere, the framework could provide actions directly.

Example:

```js
const counter = store({
  count: 0,

  actions: {
    increment(state) {
      state.count++;
    },

    decrement(state) {
      state.count--;
    },
  },
});
```

Then:

```js
counter.increment();
counter.decrement();
```

This is simpler than:

```js
dispatch({
  type: "INCREMENT",
});
```

The API remains JavaScript-first.

---

# 17. Store Usage in Components

A component could use the store directly:

```js
function Counter() {
  return Column({
    children: [
      Text(counter.count),

      Row({
        children: [
          Button("-", {
            onClick: counter.decrement,
          }),

          Button("+", {
            onClick: counter.increment,
          }),
        ],
      }),
    ],
  });
}
```

This keeps the component clean.

---

# 18. Store Computed Values

Stores should support derived values.

Example:

```js
const cart = store({
  items: [],

  computed: {
    total(state) {
      return state.items.reduce(
        (sum, item) => sum + item.price,
        0
      );
    },

    itemCount(state) {
      return state.items.length;
    },
  },
});
```

Then:

```js
Text(cart.total);
Text(cart.itemCount);
```

The dependency graph could be:

```text
cart.items
     │
     ├──────────────┐
     ▼              ▼
cart.total    cart.itemCount
     │              │
     ▼              ▼
  Text()           Text()
```

---

# 19. Store Actions and Async Operations

Actions should be able to perform asynchronous work.

Example:

```js
const auth = store({
  user: null,
  loading: false,
  error: null,

  actions: {
    async login(state, email, password) {
      state.loading = true;
      state.error = null;

      try {
        state.user = await login(email, password);
      } catch (error) {
        state.error = error;
      } finally {
        state.loading = false;
      }
    },

    logout(state) {
      state.user = null;
    },
  },
});
```

The component only needs to know:

```js
auth.login(email, password);
```

It does not need to know how authentication works internally.

---

# 20. Redux-Like Action Logging

One feature worth borrowing from Redux is action observability.

For example:

```js
store.subscribe((event) => {
  console.log(event);
});
```

The event could contain:

```js
{
  type: "auth/login",
  payload: {},
  previousState: {},
  nextState: {},
  timestamp: 123456789
}
```

This provides a foundation for:

* Debugging
* Logging
* Devtools
* Analytics
* Time-travel debugging
* Middleware

---

# 21. Optional Dispatch API

The framework does not need to force Redux-style dispatch.

However, advanced users could have:

```js
counter.dispatch({
  type: "counter/increment",
});
```

while normal users use:

```js
counter.increment();
```

This provides both simplicity and advanced control.

---

# 22. Fine-Grained Store Subscriptions

This is one of the most important requirements.

Suppose:

```js
const app = store({
  user: {...},
  theme: "dark",
  notifications: [],
});
```

A component uses:

```js
Text(app.user.name);
```

If the theme changes:

```js
app.theme = "light";
```

the user component should not need to update.

The ideal behavior is:

```text
app.theme changes
      │
      ▼
theme subscribers
      │
      ▼
affected UI only
```

rather than:

```text
app.theme changes
      │
      ▼
entire application rerenders
```

Fine-grained reactivity could be one of the framework's major technical advantages.

---

# 23. Local State vs Store

The framework should clearly distinguish between local and global state.

### Local state

```js
function Counter() {
  const count = state(0);
}
```

Use for:

* Input values
* Modal visibility
* Dropdown state
* Tabs
* Temporary UI state
* Component-specific state

### Store

```js
const auth = store({
  user: null,
});
```

Use for:

* Authentication
* Current user
* Application settings
* Shared data
* Global notifications
* Shopping cart
* Shared application state

The goal is to avoid putting everything into a global store.

---

# 24. Styling

The original framework has a chainable style API:

```js
button.style
  .width(200)
  .height(50)
  .radius(8)
  .background("#222")
  .color("white")
  .cursor("pointer");
```

The declarative API can use:

```js
Button("Click me", {
  style: {
    width: 200,
    height: 50,
    radius: 8,
    background: "#222",
    color: "white",
    cursor: "pointer",
  },
});
```

This keeps component configuration together.

---

# 25. Reactive Styling

The framework can support reactive styling.

For example:

```js
Button("Click me", {
  style: {
    width: 200,
    height: 50,
    background: "#222",

    hover: {
      background: "#444",
    },
  },
});
```

Other states could include:

```js
disabled
focused
hovered
active
selected
loading
```

The framework could internally treat these as reactive state.

---

# 26. Avoid Direct DOM Manipulation

A component should ideally not need to do this:

```js
onClick(event) {
  event.currentTarget.textContent = "Clicked!";
}
```

This mixes the declarative UI model with direct DOM manipulation.

Instead, use reactive state:

```js
function Example() {
  const clicked = state(false);

  return Button(
    computed(() =>
      clicked.value
        ? "Clicked!"
        : "Click me"
    ),
    {
      onClick: () => {
        clicked.value = true;
      },
    }
  );
}
```

The relationship becomes:

```text
clicked
   │
   ▼
computed
   │
   ▼
Button text
```

This is more consistent with the framework's architecture.

Direct DOM access can still exist as an advanced escape hatch.

---

# 27. Lifecycle

Large applications need lifecycle management.

Potential APIs:

```js
onMount(() => {
  // setup
});
```

```js
onUnmount(() => {
  // cleanup
});
```

Potentially:

```js
onUpdate(() => {
  // react to updates
});
```

Example:

```js
onMount(() => {
  const socket = connect();

  onUnmount(() => {
    socket.close();
  });
});
```

This helps prevent:

* Memory leaks
* Stale subscriptions
* Unremoved event listeners
* Timers continuing after unmount
* Open sockets

---

# 28. Async Resources

The framework could eventually provide an async resource abstraction.

Example:

```js
const users = resource(() =>
  fetch("/api/users")
);
```

The resource could expose:

```js
users.loading
users.error
users.data
```

Then:

```js
if (users.loading) {
  return Loading();
}

if (users.error) {
  return ErrorMessage(users.error);
}

return UserList(users.data);
```

This can later evolve into a more sophisticated async architecture.

---

# 29. Forms

Forms are important for serious applications.

A basic input could look like:

```js
const email = state("");

Input({
  value: email,

  onInput: (value) => {
    email.value = value;
  },
});
```

Future form APIs could support:

* Validation
* Dirty state
* Touched state
* Errors
* Submission state
* Async validation
* Form-level state

---

# 30. Routing

Routing does not necessarily need to be part of the framework core.

However, the framework should make routing easy to build.

Possible routes:

```text
/
├── dashboard
├── settings
│   ├── profile
│   └── security
├── projects
│   └── :id
└── admin
```

Potential API:

```js
router.route(
  "/dashboard",
  Dashboard
);

router.route(
  "/settings",
  Settings
);

router.route(
  "/projects/:id",
  Project
);
```

Routing could be a separate official package rather than part of the core runtime.

---

# 31. Rendering Architecture

A possible internal rendering architecture:

```text
                   Component
                       │
                       ▼
               Declarative Tree
                       │
                       ▼
                Reactive Graph
                       │
                       ▼
               Render / Reconcile
                       │
                       ▼
                      DOM
```

The renderer should understand dependencies between:

* State
* Computed values
* Components
* DOM nodes

The goal is efficient updates without unnecessary work.

---

# 32. Fine-Grained Reactivity

The framework could use dependency tracking.

Example:

```js
const firstName = state("John");
const lastName = state("Smith");

const fullName = computed(
  () =>
    `${firstName.value} ${lastName.value}`
);
```

When:

```js
firstName.value = "Jane";
```

the framework knows:

```text
firstName
    │
    ▼
fullName
    │
    ▼
Text(fullName)
```

Only the dependent UI needs to update.

---

# 33. Developer Experience

A mature framework should eventually provide:

* TypeScript support
* Excellent type inference
* Error messages
* Devtools
* State inspection
* Component inspection
* Action logging
* Performance profiling
* Testing utilities
* Documentation
* Build tooling

---

# 34. Devtools

The store architecture creates an opportunity for excellent developer tools.

Potential features:

```text
Application
├── Components
├── State
├── Computed
├── Stores
├── Actions
├── Events
└── Performance
```

A store action could show:

```text
Action: counter/increment

Previous:
{
  count: 4
}

Next:
{
  count: 5
}
```

This could eventually support time-travel debugging.

---

# 35. Persistence

Stores could optionally support persistence.

Example:

```js
const settings = store({
  theme: "dark",
  language: "en",
}, {
  persist: true,
});
```

Possible persistence targets:

* localStorage
* sessionStorage
* IndexedDB
* Custom persistence adapters

Persistence should probably be optional rather than built into every store.

---

# 36. Middleware

Advanced stores could support middleware.

For example:

```js
const store = createStore({
  middleware: [
    logger(),
    persist(),
  ],
});
```

Middleware could be used for:

* Logging
* Persistence
* Analytics
* Permissions
* Debugging
* Error handling
* Undo/redo

This provides Redux-like extensibility without forcing Redux's API.

---

# 37. SSR and Environment Handling

Components should ideally not care whether they are running in:

* Browser
* Server
* Test environment

Instead of:

```js
const page =
  typeof document === "undefined"
    ? AppView()
    : mount(AppView);
```

it may be cleaner to separate application code from the runtime entry point.

For example:

```js
// App.js

export function AppView() {
  return Column({
    children: [
      Counter(),
    ],
  });
}
```

Then the browser entry:

```js
// client.js

import { AppView } from "./App.js";
import { mount } from "../src/index.js";

mount(AppView);
```

This keeps components environment-independent.

---

# 38. Core API

A possible core API:

```js
state()
computed()
effect()

Column()
Row()
Grid()
Stack()

Text()
Button()
Input()
Image()

component()
mount()

onMount()
onUnmount()
```

Application-level APIs:

```js
store()
resource()
router()
```

Optional ecosystem packages:

```text
@framework/router
@framework/forms
@framework/devtools
@framework/testing
@framework/server
@framework/animations
```

---

# 39. Proposed Architecture

A possible overall architecture:

```text
                         Framework
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
       state()          computed()         store()
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                     Reactive Graph
                            │
                            ▼
                       Components
                            │
                            ▼
                     Declarative Tree
                            │
                            ▼
                        Renderer
                            │
                            ▼
                           DOM
```

---

# 40. State Architecture

The state layer could be:

```text
                    Reactive System
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
       state()        computed()       effect()
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
                     Dependency Graph
```

The store builds on the same reactive primitives:

```text
store()
  │
  ├── state
  ├── computed
  ├── actions
  ├── subscriptions
  └── middleware
```

---

# 41. Example Complete Application

A complete application could look like:

```js
import {
  Column,
  Row,
  Text,
  Button,
  state,
  computed,
  store,
  mount,
} from "../src/index.js";

const app = store({
  user: {
    name: "John",
  },

  theme: "dark",

  actions: {
    toggleTheme(state) {
      state.theme =
        state.theme === "dark"
          ? "light"
          : "dark";
    },
  },
});

export function Counter() {
  const count = state(0);

  const doubled = computed(
    () => count.value * 2
  );

  return Column({
    gap: 8,

    children: [
      Text(count),

      Text(doubled, {
        style: {
          color: "gray",
        },
      }),

      Row({
        gap: 8,

        children: [
          Button("-", {
            onClick: () => count.value--,
          }),

          Button("+", {
            onClick: () => count.value++,
          }),
        ],
      }),
    ],
  });
}

export function AppView() {
  const clicked = state(false);

  return Column({
    padding: 48,
    gap: 24,

    children: [
      Text(app.user.name),

      Button(
        computed(() =>
          clicked.value
            ? "Clicked!"
            : "Click me"
        ),
        {
          style: {
            width: 200,
            height: 50,
            radius: 8,
            background: "#222",
            color: "white",
            cursor: "pointer",

            hover: {
              background: "#444",
            },
          },

          onClick: () => {
            clicked.value = true;
          },
        }
      ),

      Button("Toggle theme", {
        onClick: app.toggleTheme,
      }),

      Counter(),
    ],
  });
}

mount(AppView);
```

This represents the desired direction of the framework.

---

# 42. Recommended Development Phases

## Phase 1 - Reactive Core

Implement:

* `state()`
* `computed()`
* `effect()`
* Dependency tracking
* Subscriptions
* Cleanup

Example:

```js
const count = state(0);

const doubled = computed(
  () => count.value * 2
);
```

---

## Phase 2 - Renderer

Implement:

* Components
* Element creation
* Text nodes
* Props
* Events
* Reactive DOM updates
* Mounting
* Unmounting

Goal:

```js
Column({
  children: [
    Text(count),
    Button("+"),
  ],
});
```

---

## Phase 3 - UI Primitives

Implement:

* Text
* Button
* Input
* Image
* Link
* Row
* Column
* Grid
* Stack

---

## Phase 4 - Styling

Implement:

* Width
* Height
* Padding
* Margin
* Gap
* Colors
* Radius
* Borders
* Shadows
* Typography
* Hover
* Focus
* Active
* Disabled
* Responsive styling

---

## Phase 5 - Component System

Implement:

* Functional components
* Props
* Children
* Component lifecycle
* Composition
* Component-local state

---

## Phase 6 - Store

Implement:

* `store()`
* Actions
* Computed store state
* Subscriptions
* Action events
* Middleware
* Persistence
* Devtools hooks

---

## Phase 7 - Async

Implement:

* `resource()`
* Loading state
* Error state
* Data state
* Async actions
* Cancellation
* Caching

---

## Phase 8 - Application Infrastructure

Implement separately:

* Router
* Forms
* Testing
* Devtools
* Server rendering
* Hydration
* Animations

---

# 43. API Design Principles

The framework should follow several rules.

## Rule 1 - Keep common operations short

Good:

```js
state(0)
```

Not:

```js
new ReactiveState({
  initialValue: 0,
});
```

---

## Rule 2 - Prefer composition

Good:

```js
Column({
  children: [
    Header(),
    Dashboard(),
  ],
});
```

---

## Rule 3 - Keep state separate from DOM

Prefer:

```js
const clicked = state(false);
```

over directly manipulating:

```js
element.textContent = "...";
```

---

## Rule 4 - Make simple things simple

A counter should not require:

* A reducer
* A store
* Middleware
* A provider
* A special component class

It should simply use:

```js
const count = state(0);
```

---

## Rule 5 - Make advanced features optional

Large applications can use:

```js
store()
resource()
router()
middleware()
devtools()
```

Small applications should not need them.

---

# 44. Why Not Just Copy React?

The framework does not need to replicate React's architecture.

The goal is to build something with its own strengths:

* JavaScript-first
* No mandatory JSX
* Fine-grained reactivity
* Simple state primitives
* Simple functional components
* Declarative UI
* Optional global stores
* Minimal boilerplate
* Strong TypeScript support

The framework should take inspiration from successful ideas without copying unnecessary complexity.

---

# 45. Why Not Make Everything Global?

A global store should not replace local state.

Bad:

```js
const globalStore = store({
  everyModalOpen: false,
  temporaryInputValue: "",
  hoveredButton: null,
});
```

Better:

```js
function Modal() {
  const open = state(false);
}
```

Use global stores only for genuinely shared state.

---

# 46. The Ideal Mental Model

Developers should be able to understand the framework with four concepts:

### State

```js
const count = state(0);
```

### Computed

```js
const doubled = computed(
  () => count.value * 2
);
```

### Components

```js
function Counter() {
  return Column({
    children: [
      Text(count),
    ],
  });
}
```

### Store

```js
const auth = store({
  user: null,
});
```

Everything else should build on these concepts.

---

# 47. Final Target API

The framework could eventually look like:

```js
import {
  Column,
  Row,
  Text,
  Button,
  state,
  computed,
  store,
  mount,
} from "your-framework";

const auth = store({
  user: null,

  actions: {
    logout(state) {
      state.user = null;
    },
  },
});

function Counter() {
  const count = state(0);

  const doubled = computed(
    () => count.value * 2
  );

  return Column({
    gap: 8,

    children: [
      Text(count),
      Text(doubled),

      Row({
        gap: 8,

        children: [
          Button("-", {
            onClick: () => count.value--,
          }),

          Button("+", {
            onClick: () => count.value++,
          }),
        ],
      }),
    ],
  });
}

function App() {
  return Column({
    padding: 48,
    gap: 24,

    children: [
      Counter(),

      Button("Logout", {
        onClick: auth.logout,
      }),
    ],
  });
}

mount(App);
```

---

# 48. Long-Term Architecture

The long-term architecture can be summarized as:

```text
                        APPLICATION
                             │
                             ▼
                       COMPONENT TREE
                             │
                             ▼
                    DECLARATIVE UI TREE
                             │
                             ▼
                    ┌─────────────────┐
                    │ Reactive System │
                    └─────────────────┘
                       │      │      │
                       ▼      ▼      ▼
                     State Computed Effect
                       │      │
                       └──────┼──────┐
                              │      │
                              ▼      ▼
                           Components
                              │
                              ▼
                           Renderer
                              │
                              ▼
                             DOM
```

Shared state sits alongside the component system:

```text
                    APPLICATION STORE
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
           State        Computed      Actions
              │            │            │
              └────────────┼────────────┘
                           ▼
                    Reactive System
                           │
                           ▼
                       Components
```

---

# 49. Final Philosophy

The most important design goal is not:

> "Can this framework replace React?"

The better question is:

> **Can developers build and maintain a large application with this framework without the framework getting in their way?**

The framework should remain small at its core while providing an ecosystem for more advanced functionality.

The core should focus on:

```text
state()
computed()
effect()

Column()
Row()
Text()
Button()

component()
mount()
```

Then build more advanced functionality around it:

```text
store()
resource()
router()
forms
devtools
testing
SSR
animations
```

The overall philosophy should be:

> **Simple by default, powerful when needed.**

The strongest potential differentiator is the combination of:

**Declarative JavaScript + fine-grained reactivity + functional components + optional Redux-like shared state + minimal boilerplate.**

That gives the framework a clear identity without simply becoming a React clone.
