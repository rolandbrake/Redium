import {
  Button,
  Border,
  Center,
  Column,
  Colors,
  For,
  If,
  Row,
  Root,
  Text,
  createState,
  mountElement,
} from "redium";

function Dashboard() {
  const visible = createState(false);

  return Column({
    gap: 12,
    padding: 20,
    style: { background: "azure", radius: 24, border: Border(1, Colors.black) },
    children: [
      Text("Conditional branch", { style: { font: 20, weight: 700 } }),
      Button("Toggle", {
        style: { background: "aquamarine", radius: 50, border: Border(1, Colors.black) },
        onClick: () => (visible.value = !visible.value),
      }),
      If(
        visible,
        () => Text("First text", { style: { color: "#166534" } }),
        () => Text("Second text", { style: { color: "#1d4ed8" } }),
      ),
    ],
  });
}

function Users() {
  const users = createState(["Roland", "Wassim", "Kinnan"]);

  return Column({
    gap: 10,
    padding: 20,
    style: { background: "antiquewhite", radius: 24, border: Border(1, Colors.black) },
    children: [
      Text("Keyed users", { style: { font: 20, weight: 700 } }),
      Row({
        gap: 8,
        children: [
          Button("Reverse", {
            style: { background: "aqua", radius: 50, border: Border(1, Colors.black) },
            onClick: () => (users.value = [...users.value].reverse()),
          }),
          Button("Remove Roland", {
            style: { background: "azure", radius: 50, border: Border(1, Colors.black) },
            onClick: () =>
              (users.value = users.value.filter((user) => user !== "Roland")),
          }),
        ],
      }),
      For(users, (user) => Text(user), { key: (user) => user }),
    ],
  });
}

const page = Column({
  gap: 20,
  padding: 24,
  style: { background: "aliceblue", maxWidth: 720, radius: 24, border: Border(1, Colors.black) },
  children: [
    Text("Control flow", { style: { font: 28, weight: 700 } }),
    Dashboard(),
    Users(),
  ],
});

export const controlFlowPage = mountElement(
  Root(Center(page, { padding: 16 }), { style: { background: "aliceblue" } }),
);
