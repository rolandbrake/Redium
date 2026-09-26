import {
  Button,
  Border,
  Column,
  Container,
  Colors,
  Stack,
  Text,
  createState,
  mountElement,
  ratio,
} from "redium";

const layers = Stack({
  center: true,
  minHeight: 300,
  padding: 24,
  style: { background: "aliceblue", radius: 24, border: Border(1, Colors.black) },
  children: [
    Column({
      gap: 8,
      children: [
        Text("Page content", { style: { font: 22, weight: 700 } }),
        Text("New dialogs are pushed above this base layer."),
        Container({
          gap: 6,
          padding: 16,
          style: { background: "azure", radius: 24, border: Border(1, Colors.black) },
          children: [
            Text("Layer zero", { style: { font: 18, weight: 700 } }),
            Text("This content remains underneath every dialog."),
          ],
        }),
        Container({
          padding: 16,
          style: { background: "aquamarine", radius: 24, border: Border(1, Colors.black) },
          children: [Text("Use Open dialog to add a new top layer.")],
        }),
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
      background: "azure",
      radius: 24,
      border: Border(1, Colors.black),
    },
    children: [
      Text(`Dialog ${number}`, { style: { font: 20, weight: 700 } }),
      Text("This is the top Stack layer."),
      Button("Close top dialog", {
        style: { background: "antiquewhite", radius: 50, border: Border(1, Colors.black) },
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
  height: ratio(1),
  style: { background: "aliceblue", minHeight: 1 },
  children: [
    Text("Stack layers", { style: { font: 28, weight: 700 } }),
    Button("Open dialog", {
      style: { background: "aquamarine", radius: 50, border: Border(1, Colors.black) },
      onClick: () => {
        opened.value++;
        layers.push(Dialog(opened.value));
      },
    }),
    layers,
  ],
});

export const stackPage = mountElement(page);
