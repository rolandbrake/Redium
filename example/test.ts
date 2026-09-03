import { Root } from "redium/core";
import { mountElement } from "redium/render";
import { Button, Center, Column, Row, Text } from "redium/elements";
import { createState } from "redium/state";
import { Border, min, Shadow } from "redium/style";
import { Colors } from "redium/colors";

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
            Button("-", {
              onClick: () => {
                if (count.value > 0) count.value--;
              },
            }),
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
