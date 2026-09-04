import {
  Border,
  Button,
  Colors,
  Container,
  Grid,
  Root,
  Shadow,
  Text,
  createSelector,
  mountElement,
  state,
} from "redium";

type Plan = {
  name: string;
  description: string;
  price: string;
  accent: string;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Starter",
    description: "For small experiments and personal projects.",
    price: "$0",
    accent: Colors.blue,
    features: ["1 project", "Community support", "Basic analytics"],
  },
  {
    name: "Team",
    description: "For teams building and shipping together.",
    price: "$18",
    accent: Colors.purple,
    features: ["Unlimited projects", "Team permissions", "Priority support"],
  },
  {
    name: "Scale",
    description: "For products that need room to grow.",
    price: "$42",
    accent: Colors.green,
    features: ["Advanced analytics", "Custom workflows", "Dedicated support"],
  },
];

function PlanCard(plan: Plan, selections: ReturnType<typeof state<number>>) {
  return Container({
    // Each card is an independent vertical Container. The parent Grid gives
    // it a track width; gap only controls spacing between its own children.
    gap: 14,
    padding: 24,
    style: {
      background: Colors.white,
      color: "#0f172a",
      radius: 14,
      border: Border(1, "#e2e8f0"),
      shadow: Shadow.sm,
    },
    children: [
      Text(plan.name, { style: { font: 22, weight: 700, color: plan.accent } }),
      Text(plan.description, { style: { font: 15, color: Colors.slate } }),
      Text(plan.price, { style: { font: 34, weight: 700 } }),
      Container({
        // This nested Container creates a local vertical list for the features.
        gap: 6,
        children: plan.features.map((feature) => Text(`• ${feature}`)),
      }),
      Button("Choose plan", {
        onClick: () => selections.value++,
        // 1 means 100% of this card's content width, not 100% of the page.
        style: {
          width: 1,
          background: plan.accent,
          color: Colors.white,
          radius: 8,
        },
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

  // The outer Container fills Root and stacks its children. The responsive
  // Grid below keeps the cards usable as the viewport becomes narrower.
  return Root(
    Container({
      gap: 28,
      padding: [28, 32],
      style: { background: "#f8fafc", color: "#0f172a" },
      children: [
        Container({
          gap: 8,
          children: [
            Text("Choose your workspace", { style: { font: 32, weight: 700 } }),
            Text(
              "A responsive pricing layout using Container, Grid, and reactive state.",
              {
                style: { font: 16, color: Colors.slate },
              },
            ),
          ],
        }),
      Grid({
        // The grid can begin with three columns, but minColumnWidth is the
        // responsive rule: auto-fit removes columns as space becomes scarce.
        // Grid gap is handled by the grid layout, not card width ratios.
          columns: 3,
          minColumnWidth: 240,
          gap: 20,
          children: plans.map((plan) => PlanCard(plan, selections)),
        }),
        Container({
          padding: 16,
          style: { background: "#1e293b", color: Colors.white, radius: 10 },
          children: [Text(message, { style: { font: 15 } })],
        }),
      ],
    }),
  );
}

export const page = mountElement(ContainersExample);
