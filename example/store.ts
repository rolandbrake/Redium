import {
  Border,
  Button,
  Column,
  Colors,
  If,
  Row,
  Text,
  createStore,
  mountElement,
  ratio,
} from "redium";

type AppState = { theme: "light" | "dark"; sidebarOpen: boolean };

const store = createStore<AppState>({ theme: "light", sidebarOpen: false });

const theme = store.selectState((state) => state.theme);
const sidebarOpen = store.selectState((state) => state.sidebarOpen);
const isDark = store.selectState((state) => state.theme === "dark");
const message = store.selectState((state) =>
  state.theme === "light" ? "Light theme selected" : "Dark theme selected",
);

// TODO: change this logic in the future
const transition =
  "background-color 180ms ease, color 180ms ease, border-color 180ms ease";
const palette = {
  light: {
    page: Colors.aliceblue,
    text: "#102033",
    surface: Colors.azure,
    primary: Colors.aquamarine,
    secondary: Colors.antiquewhite,
    border: Colors.black,
  },
  dark: {
    page: "#17243a",
    text: "#eef6ff",
    surface: "#263957",
    primary: "#8de0ce",
    secondary: "#c4b5fd",
    border: "#d6e6ff",
  },
};

function Sidebar() {
  const card = Column({
    padding: 16,
    style: { radius: 24, transition },
    children: [Text("Shared sidebar state is open.")],
  });
  const apply = (name: AppState["theme"]) => {
    const colors = palette[name];
    card.style
      .background(colors.surface)
      .color(colors.text)
      .border(Border(1, colors.border));
  };
  apply(theme.value);
  card.onMount(() => theme.subscribe(apply));
  return card;
}

const themeButton = Button("Toggle theme", {
  style: { radius: 50, transition },
  onClick: () =>
    store.updateState((state) => ({
      ...state,
      theme: state.theme === "light" ? "dark" : "light",
    })),
});
const sidebarButton = Button("Toggle sidebar", {
  style: { radius: 50, transition },
  onClick: () =>
    store.updateState((state) => ({
      ...state,
      sidebarOpen: !state.sidebarOpen,
    })),
});
const page = Column({
  gap: 16,
  padding: [24, 16, 48],
  minHeight: ratio(1),
  wrap: false,
  style: { transition },
  children: [
    Text("Application store", { style: { font: 28, weight: 700 } }),
    Text(theme),
    Text(message),
    Row({ gap: 8, children: [themeButton, sidebarButton] }),
    If(
      isDark,
      () => Text("Dark branch is active."),
      () => Text("Light branch is active."),
    ),
    If(sidebarOpen, Sidebar, () => Text("Shared sidebar state is closed.")),
  ],
});

function applyTheme(name: AppState["theme"]) {
  const colors = palette[name];
  page.style.background(colors.page).color(colors.text);
  themeButton.style
    .background(colors.primary)
    .color(colors.text)
    .border(Border(1, colors.border));
  sidebarButton.style
    .background(colors.secondary)
    .color(colors.text)
    .border(Border(1, colors.border));
}
applyTheme(theme.value);
page.onMount(() => theme.subscribe(applyTheme));
export const storePage = mountElement(page);
