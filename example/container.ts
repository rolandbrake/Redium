import { Container, Root, Text, mountElement } from "redium";

function Panel(title: string, body: string, color: string) {
  return Container({
    gap: 8,
    padding: 16,
    style: {
      background: color,
      color: "#172033",
      radius: 12,
      minHeight: 96,
    },
    children: [Text(title, { style: { font: 18, weight: 700 } }), Text(body)],
  });
}

function ContainerStudy() {
  return Root(
    Container({
      gap: 16,
      padding: 20,
      style: { background: "#f8fafc", color: "#172033" },
      children: [
        Text("Container behavior", { style: { font: 28, weight: 700 } }),
        Text("Containers are vertical, responsive, and wrapping by default."),
        Container({
          row: true,
          gap: 12,
          children: [
            Panel("A", "Row mode", "#fecdd3"),
            Panel(
              "B",
              "Children share one line until space runs out.",
              "#bfdbfe",
            ),
          ],
        }),
        Container({
          row: true,
          wrap: true,
          gap: 12,
          children: [
            Container({
              width: 0.48,
              padding: 16,
              style: { background: "#fde68a", radius: 12 },
              children: [Text("48% child")],
            }),
            Container({
              width: 0.48,
              padding: 16,
              style: { background: "#bbf7d0", radius: 12 },
              children: [Text("48% child")],
            }),
            Container({
              width: 0.48,
              padding: 16,
              style: { background: "#c4b5fd", radius: 12 },
              children: [Text("Wraps on narrow screens")],
            }),
          ],
        }),
        Panel(
          "Nested container",
          "Every container creates a local layout context for its own children.",
          "#e0e7ff",
        ),
      ],
    }),
  );
}

export const page = mountElement(ContainerStudy);
