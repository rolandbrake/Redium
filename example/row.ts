import { Container, Root, Row, Text, mountElement } from "../src/index.js";

function Item(label: string, width: number, color: string) {
  return Container({
    width,
    padding: 16,
    style: { background: color, radius: 12, minHeight: 72 },
    children: [Text(label, { style: { font: 18, weight: 700 } })],
  });
}

function RowStudy() {
  return Root(
    Container({
      gap: 20,
      padding: 20,
      style: { background: "#f8fafc", color: "#172033" },
      children: [
        Text("Row behavior", { style: { font: 28, weight: 700 } }),
        Text("Rows are horizontal and do not wrap by default."),
        Row({
          gap: 12,
          children: [
            Item("30%", 0.3, "#fecdd3"),
            Item("30%", 0.3, "#bfdbfe"),
            Item("30%", 0.3, "#bbf7d0"),
          ],
        }),
        Text("This row keeps its children on one line. The library accounts for the gap when calculating their widths."),
        Row({
          wrap: true,
          gap: 12,
          children: [
            Item("Wrap A", 0.45, "#fde68a"),
            Item("Wrap B", 0.45, "#c4b5fd"),
            Item("Wrap C", 0.45, "#fed7aa"),
          ],
        }),
        Text("Enable wrap to let row children move to another line on smaller screens."),
      ],
    }),
  );
}

export const page = mountElement(RowStudy);
