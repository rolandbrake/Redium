import {
  Button,
  Column,
  For,
  If,
  Row,
  Text,
  createState,
  mountElement,
} from "redium";

function Dashboard() {
  const visible = createState(false);

  return Column({
    gap: 12,
    padding: 20,
    style: { background: "#ffffff", radius: 12 },
    children: [
      Text("Conditional branch", { style: { font: 20, weight: 700 } }),
      Button("Toggle", {
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
    style: { background: "#ffffff", radius: 12 },
    children: [
      Text("Keyed users", { style: { font: 20, weight: 700 } }),
      Row({
        gap: 8,
        children: [
          Button("Reverse", {
            onClick: () => (users.value = [...users.value].reverse()),
          }),
          Button("Remove Roland", {
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
  style: { background: "#f1f5f9", minHeight: 1 },
  children: [
    Text("Control flow", { style: { font: 28, weight: 700 } }),
    Dashboard(),
    Users(),
  ],
});

export const controlFlowPage = mountElement(page);
