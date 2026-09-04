import {
  Border, Button, Colors, Container, Grid, Column, Root, Row, Shadow,
  Text, createState, mountElement,
} from "../src/index.js";

const colors = {
  background: "#f8fafc", surface: Colors.white, text: "#0f172a",
  muted: Colors.slate, border: "#e2e8f0",
};

function Header() {
  const notifications = createState(3);
  return Container({
    padding: [18, 24], style: { background: Colors.blue, color: Colors.white },
    children: [Row({
      gap: 16, wrap: true,
      children: [
        Container({
          fill: 1, minWidth: 220,
          children: [
            Text("Redium Dashboard", { style: { font: 22, weight: 700 } }),
            Text("A responsive application shell"),
          ],
        }),
        Container({
          padding: [10, 0],
          children: [Text(notifications.map((value) => `${value} notifications`))],
        }),
        Button("Notify", {
          onClick: () => notifications.value++,
          style: { background: Colors.white, color: Colors.blue, radius: 8 },
        }),
      ],
    })],
  });
}

function Sidebar() {
  return Container({
    width: 220, fit: 0, padding: 20, gap: 12,
    style: { background: "#1e293b", color: Colors.white, radius: 12 },
    children: [
      Text("Workspace", { style: { font: 18, weight: 700 } }),
      Text("Overview"), Text("Projects"), Text("Activity"), Text("Settings"),
    ],
  });
}

function MetricCard(label: string, value: string, accent: string) {
  return Container({
    gap: 8, padding: 20,
    style: {
      background: colors.surface, color: colors.text, radius: 12,
      border: Border(1, colors.border), shadow: Shadow.sm,
    },
    children: [
      Text(label, { style: { font: 14, color: colors.muted } }),
      Text(value, { style: { font: 28, weight: 700, color: accent } }),
    ],
  });
}

function MainContent() {
  return Column({
    fill: 1, minWidth: 280, gap: 20, padding: 4,
    style: { color: colors.text },
    children: [
      Container({
        gap: 6,
        children: [
          Text("Overview", { style: { font: 28, weight: 700 } }),
          Text("A small dashboard composed from Redium layout primitives.", {
            style: { font: 15, color: colors.muted },
          }),
        ],
      }),
      Grid({
        columns: 3, minColumnWidth: 180, gap: 16,
        children: [
          MetricCard("Active projects", "12", Colors.blue),
          MetricCard("Completed tasks", "84", Colors.green),
          MetricCard("Team members", "08", Colors.purple),
        ],
      }),
      Container({
        gap: 8, padding: 20,
        style: {
          background: colors.surface, color: colors.text, radius: 12,
          border: Border(1, colors.border), shadow: Shadow.sm,
        },
        children: [
          Text("Recent activity", { style: { font: 20, weight: 700 } }),
          Text("The main content grows into available space and wraps its grid on smaller screens.", {
            style: { font: 15, color: colors.muted },
          }),
        ],
      }),
    ],
  });
}

function LayoutExample() {
  return Root(Column({
    gap: 16, padding: 16,
    style: { background: colors.background, color: colors.text },
    children: [
      Header(),
      Row({ gap: 16, wrap: true, children: [Sidebar(), MainContent()] }),
    ],
  }));
}

export const page = mountElement(LayoutExample);
