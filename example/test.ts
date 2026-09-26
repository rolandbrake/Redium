import { Container, Root, Text } from "redium";
import { mountElement } from "redium/render";
import { Colors } from "redium/colors";

const View = () => {
  return Container({
    center: true,
    style: {
      height: 0.999999,
      background: Colors.red,
    },
    children: [
      Text("Hello, Redium!", {
        style: { color: Colors.white, font: 24, weight: 700 },
      }),
    ],
  });
};

mountElement(Root(View(), { style: { background: Colors.gray } }));
