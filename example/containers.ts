import {
  Border,
  Button,
  Colors,
  Container,
  Grid,
  Root,
  State,
  Text,
  createSelector,
  createState,
  mountElement,
  ratio,
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

function PlanCard(plan: Plan, selectedPlan: State<string | null>) {
  const selected = createSelector(() => selectedPlan.value === plan.name);
  const card = Container({
    gap: 14,
    padding: 24,
    style: {
      background: "azure",
      color: Colors.black,
      radius: 24,
      border: Border(1, Colors.black),
    },
    children: [
      Text(plan.name, { style: { font: 22, weight: 700, color: plan.accent } }),
      Text(plan.description, { style: { font: 15, color: Colors.black } }),
      Text(plan.price, { style: { font: 34, weight: 700 } }),
      Container({
        gap: 6,
        children: plan.features.map((feature) => Text(`• ${feature}`)),
      }),
      Button(
        selected.map((value) => (value ? "Selected" : "Choose plan")),
        {
          onClick: () => (selectedPlan.value = plan.name),
          style: {
            width: ratio(1),
            background: "aquamarine",
            color: Colors.black,
            radius: 50,
            border: Border(1, Colors.black),
          },
        },
      ),
    ],
    onMount: () =>
      selected.subscribe((isSelected) => {
        card.style.background(isSelected ? "aquamarine" : "azure");
      }),
  });
  return card;
}

function ContainersExample() {
  const selectedPlan = createState<string | null>(null);
  const message = createSelector(() =>
    selectedPlan.value === null
      ? "Choose a plan to see reactive state in action."
      : `${selectedPlan.value} is selected.`,
  );
  return Root(
    Container({
      gap: 28,
    padding: [24, 16, 48],
      minHeight: ratio(1),      
      wrap: false,
      style: { background: "aliceblue", color: Colors.black },
      children: [
        Container({
          gap: 8,
          children: [
            Text("Choose your workspace", { style: { font: 32, weight: 700 } }),
            Text(
              "A responsive pricing layout using Container, Grid, and reactive state.",
              { style: { font: 16, color: Colors.black } },
            ),
          ],
        }),
        Grid({
          columns: 3,
          minColumnWidth: 240,
          gap: 20,
          children: plans.map((plan) => PlanCard(plan, selectedPlan)),
        }),
        Container({
          padding: 16,
          style: {
            background: "antiquewhite",
            color: Colors.black,
            radius: 24,
            border: Border(1, Colors.black),
          },
          children: [Text(message, { style: { font: 15 } })],
        }),
      ],
    }),
  );
}

export const page = mountElement(ContainersExample);
