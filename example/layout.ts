import {
  Border,
  Button,
  Colors,
  Container,
  Grid,
  Column,
  Root,
  Row,
  Text,
  createState,
  mountElement,
  ratio,
} from "redium";

const colors = {
  background: Colors.aliceblue,
  surface: Colors.azure,
  text: Colors.black,
  muted: Colors.black,
};

function Header() {
  const notifications = createState(3);
  // The header is vertical by default. Its child Row creates the toolbar;
  // wrap lets the actions move to a new line on narrow screens.
  return Container({
    padding: [18, 24],

    style: {
      background: "aqua",
      color: Colors.black,
      radius: 24,
      border: Border(1, Colors.black),
    },
    children: [
      Row({
        gap: 16,
        wrap: true,
        children: [
          Container({
            // Grow into remaining row space instead of using a fragile
            // percentage width. minWidth keeps the title readable.
            grow: 1,
            minWidth: 220,
            children: [
              Text("Redium Dashboard", { style: { font: 22, weight: 700 } }),
              Text("A responsive application shell"),
            ],
          }),
          Container({
            padding: [10, 0],
            children: [
              Text(notifications.map((value) => `${value} notifications`)),
            ],
          }),
          Button("Notify", {
            onClick: () => notifications.value++,
            style: {
              background: "antiquewhite",
              color: Colors.black,
              radius: 50,
              border: Border(1, Colors.black),
            },
          }),
        ],
      }), // Row
    ],
  });
}

function Sidebar() {
  return Container({
    // Keep navigation stable while the main content takes remaining space.
    // shrink: 0 prevents flexbox from shrinking this 220px sidebar.
    width: 220,
    shrink: 0,
    padding: 20,
    gap: 12,
    style: {
      background: "aquamarine",
      color: Colors.black,
      radius: 24,
      border: Border(1, Colors.black),
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
    gap: 8,
    padding: 20,
    style: {
      background: colors.surface,
      color: colors.text,
      radius: 24,
      border: Border(1, Colors.black),
    },
    children: [
      Text(label, { style: { font: 14, color: colors.muted } }),
      Text(value, { style: { font: 28, weight: 700, color: accent } }),
    ],
  });
}

function MainContent() {
  return Column({
    // grow consumes the space left by the sidebar. minWidth gives the parent
    // Row a useful breakpoint: below this width, the row wraps this column.
    grow: 1,
    minWidth: 280,
    gap: 20,
    padding: 4,
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
        // minColumnWidth lets the grid reduce its column count automatically,
        // keeping cards readable instead of allowing horizontal overflow.
        columns: 3,
        minColumnWidth: 180,
        gap: 16,
        children: [
          MetricCard("Active projects", "12", Colors.blue),
          MetricCard("Completed tasks", "84", Colors.green),
          MetricCard("Team members", "08", Colors.purple),
        ],
      }),
      Container({
        gap: 8,
        padding: 20,
        style: {
          background: colors.surface,
          color: colors.text,
          radius: 24,
          border: Border(1, Colors.black),
        },
        children: [
          Text("Recent activity", { style: { font: 20, weight: 700 } }),
          Text(
            "The main content grows into available space and wraps its grid on smaller screens.",
            {
              style: { font: 15, color: colors.muted },
            },
          ),
        ],
      }), // Container
    ],
  }); // Column
}

function LayoutExample() {
  // Root supplies the viewport-sized surface. The outer Column stacks the
  // header above the application area; the inner Row handles its own layout.
  return Root(
    Column({
      gap: 16,
      padding: 16,
      style: {
        background: colors.background,
        color: colors.text,
        height: ratio(1),
      },
      children: [
        Header(),
        // The Row owns the 16px gap. Fixed and flexible widths are used here
        // so spacing is not added on top of percentage widths.
        Row({ gap: 16, wrap: true, children: [Sidebar(), MainContent()] }),
      ],
    }), // Column
  ); // Root
}

export const page = mountElement(LayoutExample);
