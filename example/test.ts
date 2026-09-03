import {
  Root,
  Button,
  Column,
  Row,
  Text,
  createState,
  min,
  mountElement,
  Shadow,
  Colors,
  Center,
  Border
} from "redium";

const Counter = () => {
  const count = createState(0);

  return Center(
    Column({
      gap: 16,
      padding: [24, 32],
      style: {
        width: min(1, 384),
        background: Colors.white,
        radius: 16,
        border: Border(2, Colors.black),
        shadow: Shadow.md,
      },
      children: [
        Center(Text(count, { style: { font: 48, weight: 700 } })),
        Row({
          gap: 8,
          center: true,
          children: [
            Button("-", { onClick: () => count.value-- }),
            Button("Reset", { onClick: () => (count.value = 0) }),
            Button("+", { onClick: () => count.value++ }),
          ],
        }), // Row
      ],
    }), // Column
  ); // Center
};

mountElement(
  Root(Counter(), {
    style: { background: Colors.gray },
  }),
);
