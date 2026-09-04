import { Column, Container, Root, Text, mountElement } from "redium";

function Section(title: string, description: string, color: string) {
  return Container({
    width: 1,
    gap: 8,
    padding: 16,
    style: { background: color, radius: 12 },
    children: [
      Text(title, { style: { font: 18, weight: 700 } }),
      Text(description),
    ],
  });
}

function ColumnStudy() {
  return Root(
    Container({
      gap: 16,
      padding: 20,
      style: { background: "#f8fafc", color: "#172033" },
      children: [
        Text("Column behavior", { style: { font: 28, weight: 700 } }),
        Text("Columns stack children vertically and preserve their order."),
        Column({
          gap: 12,
          padding: 12,
          style: { background: "#e2e8f0", radius: 12 },
          children: [
            Section("First", "The first child appears at the top.", "#fecdd3"),
            Section("Second", "The gap is applied between siblings.", "#bfdbfe"),
            Section("Third", "Children can be nested columns or other elements.", "#bbf7d0"),
          ],
        }),
        Column({
          gap: 12,
          center: true,
          children: [
            Container({ width: 0.7, padding: 16, style: { background: "#fde68a", radius: 12 }, children: [Text("70% centered child")] }),
            Container({ width: 0.4, padding: 16, style: { background: "#c4b5fd", radius: 12 }, children: [Text("40% centered child")] }),
          ],
        }),
      ],
    }),
  );
}

export const page = mountElement(ColumnStudy);
