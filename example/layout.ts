import {
  Button,
  Color,
  Container,
  Grid,
  Row,
  Column,
  Root,
  Shadow,
  Text,
  clamp,
  createState,
  mountElement,
  min,
  max,
} from "../src/index.js";

const colors = {
  background: "#f8fafc",
  surface: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
};

function Header() {
  const notifications = createState(0);

  return Container({
    padding: [18, 24],
    style: { background: Color.blue, color: Color.white },
    children: [
      Row({
        gap: 16,
        wrap: true,
        children: [
          Text("Redium Dashboard", {
            style: { width: 0.6, font: 22, weight: 700 },
          }),
          Text(
            notifications.map((value) => `${value} notifications`),
            { style: { width: 0.25, font: 14 } },
          ),
          Button("Notify", {
            onClick: () => notifications.value++,
            style: {
              width: 0.15,
              background: Color.white,
              color: Color.blue,
            },
          }),
        ],
      }),
    ],
  });
}

function Sidebar() {
  return Row({
    gap: 16,
    padding: 20,
    style: {
      width: 0.22,
      minWidth: min(180, 1),
      background: Color.slate,
      color: Color.white,
    },
    children: [
      Text("Workspace", { style: { font: 18, weight: 700 } }),
      Text("Overview"),
      Text("Projects"),
      Text("Activity"),
      Text("Settings"),
    ],
  });
}

function MetricCard(label: string, value: string, accent: string) {
  return Container({
    padding: 20,
    style: {
      background: colors.surface,
      color: colors.text,
      radius: 12,
      shadow: Shadow.sm,
    },
    children: [
      Text(label, { style: { font: 14, color: colors.muted } }),
      Text(value, { style: { font: 28, weight: 700, color: accent } }),
    ],
  });
}

function MainContent() {
  return Column({
    gap: 20,
    padding: 24,
    style: {
      width: max(320, 0.78),
      background: colors.background,
      color: colors.text,
    },
    children: [
      Container({
        children: [
          Text("Overview", { style: { font: 28, weight: 700 } }),
          Text("A small dashboard composed from Redium layout primitives.", {
            style: { font: 15, color: colors.muted },
          }),
        ],
      }),
      Grid({
        columns: 3,
        wrap: true,
        minColumnWidth: clamp(180, 0.25, 320),
        gap: 16,
        children: [
          MetricCard("Active projects", "12", Color.blue),
          MetricCard("Completed tasks", "84", Color.green),
          MetricCard("Team members", "08", Color.purple),
        ],
      }),
      Container({
        padding: 20,
        style: { background: colors.surface, color: colors.text, radius: 12, shadow: Shadow.sm },
        children: [
          Text("Recent activity", { style: { font: 20, weight: 700 } }),
          Text("The dashboard stays readable as the viewport changes.", {
            style: { font: 15, color: colors.muted },
          }),
        ],
      }),
    ],
  });
}

function LayoutExample() {
  return Root(
    Column({
      children: [
        Header(),
        Row({
          wrap: true,
          gap: 16,
          children: [Sidebar(), MainContent()],
        }),
      ],
    }),
  );
}

export const page = mountElement(LayoutExample);
