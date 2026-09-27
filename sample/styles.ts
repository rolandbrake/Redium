import { Colors, Shadow, Style, min, ratio } from "redium";

export const pageStyle = new Style({
  background: "#f8fafc",
  minHeight: ratio(1),
  padding: [48, 20],
});

export const panelStyle = new Style({
  width: min(ratio(1), 720),
  background: Colors.white,
  radius: 20,
  padding: 28,
  shadow: Shadow.lg,
});

export const mutedText = new Style({ color: Colors.slate });
