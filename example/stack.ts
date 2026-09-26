import {
  Button,
  Column,
  Shadow,
  Stack,
  Text,
  createState,
  mountElement,
} from "redium";

const layers = Stack({
  center: true,
  minHeight: 300,
  padding: 24,
  style: { background: "#dbeafe", radius: 16 },
  children: [
    Column({
      gap: 8,
      children: [
        Text("Page content", { style: { font: 22, weight: 700 } }),
        Text("New dialogs are pushed above this base layer."),
      ],
    }),
  ],
});

const opened = createState(0);

function Dialog(number: number) {
  return Column({
    gap: 14,
    padding: 24,
    style: {
      width: 0.8,
      maxWidth: 360,
      background: "#ffffff",
      radius: 14,
      shadow: Shadow.lg,
    },
    children: [
      Text(`Dialog ${number}`, { style: { font: 20, weight: 700 } }),
      Text("This is the top Stack layer."),
      Button("Close top dialog", {
        onClick: () => {
          layers.pop();
          opened.value = 0;
        },
      }),
    ],
  });
}

const page = Column({
  gap: 16,
  padding: 24,
  style: { background: "#f8fafc", minHeight: 1 },
  children: [
    Text("Stack layers", { style: { font: 28, weight: 700 } }),
    Button("Open dialog", {
      onClick: () => {
        opened.value++;
        layers.push(Dialog(opened.value));
      },
    }),
    layers,
  ],
});

export const stackPage = mountElement(page);
