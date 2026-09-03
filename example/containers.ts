import {
  Button,
  Color,
  Container,
  Column,
  Root,
  Row,
  Shadow,
  Text,
  createSelector,
  mountElement,
  state,
} from "../src/index.js";

type Plan = {
  name: string;
  description: string;
  price: string;
  color: string;
};

const plans: Plan[] = [
  {
    name: "Starter",
    description: "For small experiments and personal projects.",
    price: "$0",
    color: Color.blue,
  },
  {
    name: "Team",
    description: "For teams building and shipping together.",
    price: "$18",
    color: Color.purple,
  },
  {
    name: "Scale",
    description: "For products that need room to grow.",
    price: "$42",
    color: Color.green,
  },
];

function PlanCard(plan: Plan, selections: ReturnType<typeof state<number>>) {
  return Container({
    padding: 24,
    style: {
      width: 0.33,
      minWidth: 240,
      background: Color.white,
      color: "#0f172a",
      radius: 14,
      shadow: Shadow.sm,
    },
    children: [
      Text(plan.name, { style: { font: 22, weight: 700, color: plan.color } }),
      Text(plan.description, { style: { font: 15, color: Color.slate } }),
      Text(plan.price, { style: { font: 34, weight: 700 } }),
      Button("Choose plan", {
        onClick: () => selections.value++,
        style: { width: 1, background: plan.color, color: Color.white },
      }),
    ],
  });
}

function ContainersExample() {
  const selections = state(0);
  const message = createSelector(() =>
    selections.value === 0
      ? "Choose a plan to see reactive state in action."
      : `${selections.value} plan selection${selections.value === 1 ? "" : "s"} recorded.`,
  );

  return Root(
    Column({
      gap: 28,
      padding: 32,
      style: { width: 1, maxWidth: 1100, background: "#f8fafc" },
      children: [
        Container({
          children: [
            Text("Choose your workspace", { style: { font: 32, weight: 700 } }),
            Text("Resize the window to see the cards wrap naturally.", {
              style: { font: 16, color: Color.slate },
            }),
          ],
        }),
        Row({
          wrap: true,
          gap: 20,
          children: plans.map((plan) => PlanCard(plan, selections)),
        }),
        Container({
          padding: 16,
          style: { background: Color.slate, color: Color.white, radius: 10 },
          children: [Text(message, { style: { font: 15 } })],
        }),
      ],
    }),
  );
}

export const page = mountElement(ContainersExample);
