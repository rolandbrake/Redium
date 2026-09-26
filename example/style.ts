import {
  Border,
  Center,
  Column,
  Colors,
  Container,
  Root,
  Style,
  Text,
  mountElement,
} from "redium";

// Both cards use this exact shared appearance. Redium resolves the same
// declarations to the same private r-* class instead of creating one class per
// element. Inspect either card in browser developer tools to see the match.
const sharedCard = new Style({
  background: "azure",
  border: Border(1, Colors.black),
  radius: 24,
  padding: 20,
});

function SharedCard(title: string, description: string) {
  return Container({
    gap: 8,
    style: sharedCard,
    children: [
      Text(title, { style: { font: 20, weight: 700 } }),
      Text(description),
    ],
  });
}

const page = Column({
  gap: 16,
  padding: 24,
  maxWidth: 720,
  style: { background: "aliceblue", radius: 24, border: Border(1, Colors.black) },
  children: [
    Text("Reusable styles", { style: { font: 28, weight: 700 } }),
    Text("These two cards share one Style instance and therefore one generated class."),
    SharedCard("First card", "Same declarations, same private class."),
    SharedCard("Second card", "No duplicate CSS rule is created."),
  ],
});

export const stylePage = mountElement(
  Root(Center(page, { padding: 16 }), { style: { background: "aliceblue" } }),
);
