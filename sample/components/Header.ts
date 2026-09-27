import { Column, Colors, Text } from "redium";
import { mutedText } from "../styles";

export function Header() {
  return Column({
    gap: 8,
    children: [
      Text("Focus Board", {
        style: { color: "#0f172a", font: 32, weight: 700 },
      }),
      Text("A small project organized with ordinary Redium components.", {
        style: mutedText,
      }),
      Text("TODAY", { style: { color: Colors.blue, font: 12, weight: 700 } }),
    ],
  });
}
