import { Grid, Root, Text, Container, mountElement, Colors, ratio } from "redium";

function Tile(number: number, color: string) {
  return Container({
    padding: 20,
    minHeight: 160,
    style: { background: color, radius: 12 },
    children: [
      Text(`Tile ${number}`, { style: { font: 18, weight: 700 } }),
      Text("Grid items stretch into equal tracks."),
    ],
  }); // Container
}

function GridStudy() {
  return Root(
    Container({
      gap: 16,
      padding: [20, 16, 48],
      minHeight: ratio(1),
      wrap: false,
      style: { background: "#f8fafc", color: "#172033" },
      children: [
        Text("Grid behavior", { style: { font: 28, weight: 700 } }),
        Text("Resize the window to see the auto-fit columns change."),
        Grid({
          columns: 3,
          minColumnWidth: 180,
          gap: 12,
          padding: 12,
          children: [
            Tile(1, "#fecdd3"),
            Tile(2, "#bfdbfe"),
            Tile(3, "#bbf7d0"),
            Tile(4, "#fde68a"),
            Tile(5, "#c4b5fd"),
            Tile(6, "#fed7aa"),
          ],
        }),
        Text(
          "Try removing minColumnWidth or changing columns to compare fixed and responsive tracks.",
        ),
      ],
    }), // Container
  ); // Root
}

export const page = mountElement(GridStudy);
