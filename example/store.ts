import {
  Border,
  Button,
  Colors,
  Column,
  If,
  Row,
  Text,
  createStore,
  mountElement,
  ratio,
} from "redium";

type AppState = {
  theme: "light" | "dark";
  sidebarOpen: boolean;
};

// A module-scoped store is shared by every component that imports it.
const appStore = createStore<AppState>({
  theme: "light",
  sidebarOpen: false,
});

const theme = appStore.selectState((state) => state.theme);
const sidebarOpen = appStore.selectState((state) => state.sidebarOpen);
const darkTheme = appStore.selectState((state) => state.theme === "dark");
const themeMessage = appStore.selectState((state) =>
  state.theme === "light" ? "Light theme selected" : "Dark theme selected",
);

const actions = {
  toggleTheme() {
    appStore.updateState((state) => ({
      ...state,
      theme: state.theme === "light" ? "dark" : "light",
    }));
  },
  toggleSidebar() {
    appStore.updateState((state) => ({
      ...state,
      sidebarOpen: !state.sidebarOpen,
    }));
  },
};

const page = Column({
  gap: 16,
  padding: 24,
  height: ratio(1),
  style: {
    minHeight: 1,
  },
  onMount: () =>
    theme.subscribe((currentTheme) => {
      page.style.background(currentTheme === "dark" ? "#2c4c70" : "#ffffff");
    }),
  children: [
    Text("Application store", { style: { font: 28, weight: 700 } }),
    Text(theme),
    Text(themeMessage),
    Row({
      gap: 8,
      children: [
        Button("Toggle theme", {
          style: {
            border: Border(1, Colors.black),
            background: Colors.emerald,
            radius: 50,
          },
          onClick: actions.toggleTheme,
        }),
        Button("Toggle sidebar", {
          style: {
            border: Border(1, Colors.black),
            background: Colors.indigo,
            radius: 50,
          },
          onClick: actions.toggleSidebar,
        }),
      ],
    }),
    If(
      darkTheme,
      () => Text("Dark branch is active.", { style: { color: "#1d4ed8" } }),
      () => Text("Light branch is active.", { style: { color: "#b45309" } }),
    ),
    If(
      sidebarOpen,
      () =>
        Column({
          padding: 16,
          style: { background: "#dbeafe", radius: 12 },
          children: [Text("Shared sidebar state is open.")],
        }),
      () => Text("Shared sidebar state is closed."),
    ),
  ],
});

export const storePage = mountElement(page);
