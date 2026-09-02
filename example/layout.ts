import {
  Root,
  Column,
  Center,
  Row,
  Grid,
  Container,
  Text,
  Button,
  createState,
  createSelector,
  mountElement,
  min,
  max,
  clamp,
  px,
} from "../src/index.js";

function Header() {
  const actionCount = createState(0);
  return Container({
    padding: 20,
    style: { background: "#2563eb", color: "#ffffff" },
    children: [
      Center(Row({
          gap: 16,

          children: [
            Text("Redium", {
              style: {
                width: 0.5,
                maxWidth: min("100%", px(240)),
                font: 24,
                weight: 700,
              },
            }), // Text
            Text(
              createSelector(() => `Actions: ${actionCount.value}`),
              {
                style: { width: 0.3, font: 16 },
              },
            ), // Text
            Button("Action", {
              onClick: () => {
                actionCount.value += 1;
              },
              style: {
                width: 0.2,
                // width: min(px(180), "100%"),
                background: "#dd2cc6",
                color: "#ffffff",
              },
            }), // Button
          ],
        }), // Row
      ), // Center
    ],
  }); // Container
} // Header

function Sidebar() {
  const items = ["Dashboard", "Products", "Customers", "Settings"];
  return Column({
    wrap: true,
    gap: 16,
    padding: 20,
    style: {
      width: 0.2,
      minWidth: min(px(180), "100%"),
      background: "#dc2626",
      color: "#ffffff",
    },
    children: [
      Text("Navigation", { style: { font: 20, weight: 700 } }), // Text
      ...items.map((item) => Text(item)), // Text
    ],
  }); // Column
} // Sidebar

function Card(title: string, color: string) {
  return Container({
    padding: 20,
    style: {
      minWidth: min(px(180), "100%"),
      background: color,
      radius: 12,
      shadow: "sm",
      color: "#ffffff",
    },
    children: [
      Column({
        gap: 8,
        children: [
          Text(title, { style: { font: 18, weight: 700 } }), // Text
          Text("This card adapts to its grid cell."), // Text
          Button("Open", { style: { width: "100%" } }), // Button
        ],
      }), // Column
    ],
  }); // Container
} // Card

function MainSection() {
  const contents = [
    ["Content A", "#15803d"],
    ["Content B", "#166534"],
    ["Content C", "#14532d"],
  ];

  return Column({
    wrap: true,
    gap: 20,
    padding: 24,
    style: {
      width: max(px(320), 0.8),
      background: "#16a34a",
      color: "#ffffff",
    },
    children: [
      Text("Main Section", { style: { font: 28, weight: 700 } }),
      Text("Resize the browser to see the layout adapt."),
      Grid({
        wrap: true,
        columns: 3,
        minColumnWidth: clamp(px(180), "25vw", px(320)),
        gap: 16,
        children: contents.map(([content, color]) => Card(content, color)),
      }),
    ],
  });
}

function Footer() {
  return Container({
    padding: 20,
    style: { background: "#9333ea", color: "#ffffff" },
    children: [
      Text("Footer", { style: { font: 16, weight: 700 } }), // Text
    ],
  }); // Container
} // Footer

export function LayoutExample() {
  return Root(Column({
      gap: 0,
      children: [
        Header(), // Header
        Row({
          wrap: true,
          children: [Sidebar(), MainSection()],
        }), // Row
        Footer(), // Footer
      ],
    }), // Column
  ); // Root
} // LayoutExample

export const page = mountElement(LayoutExample); // mountElement
