import { Root, Grid, Container, Text, mountElement } from "../src/index.js";

function Box(label: string, color: string) {
  return Container({
    fit: 1,
    fill: 1,
    padding: 24,
    style: {
      background: color,
      color: "#ffffff",
      radius: 12,
      minHeight: 140,
    },
    children: [Text(label, { style: { font: 24, weight: 700 } })],
  }); // Container
}

function LayoutTest() {
  const contents = [
    { label: "RED", color: "#ef4444" },
    { label: "BLUE", color: "#3b82f6" },
    { label: "GREEN", color: "#22c55e" },
    { label: "YELLOW", color: "#eab308" },
    { label: "PURPLE", color: "#a855f7" },
    { label: "PINK", color: "#ec4899" },
    { label: "ORANGE", color: "#f97316" },
    { label: "TEAL", color: "#14b8a6" },
  ];
  return Root({
    body: Grid({
      columns: 3,
      wrap: true,
      minColumnWidth: 300,
      gap: 16,
      padding: 16,
      children: [...contents.map((c) => Box(c.label, c.color))],
    }), // Grid
  }); // Root
}

export const page = mountElement(LayoutTest);
