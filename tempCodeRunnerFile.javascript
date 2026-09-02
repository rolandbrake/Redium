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
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
  },
});

export function Counter() {
  const count = state(0);

  const doubled = selector(() => count.value * 2);

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
        computed(() => (clicked.value ? "Clicked!" : "Click me")),
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
        },
      ),

      Button("Toggle theme", {
        onClick: app.toggleTheme,
      }),

      Counter(),
    ],
  });
}

mount(AppView);
