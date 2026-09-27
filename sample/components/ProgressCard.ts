import { Column, Container, Row, Text, ratio } from "redium";
import { completedCount, progress, remainingCount } from "../state/tasks";

export function ProgressCard() {
  return Column({
    gap: 12,
    padding: 18,
    style: { background: "#eff6ff", radius: 14 },
    children: [
      Row({
        children: [
          Column({
            gap: 4,
            children: [
              Text("Your progress", {
                style: { color: "#1e3a8a", font: 14, weight: 700 },
              }),
              Text(progress, { style: { color: "#475569", font: 14 } }),
            ],
          }),
          Text(
            completedCount.map((count) => `${count} done`),
            {
              style: { color: "#2563eb", font: 14, weight: 700 },
            },
          ),
        ],
      }),
      Container({
        height: 8,
        style: { background: "#bfdbfe", radius: 99 },
        children: [
          Container({
            height: 8,
            style: { width: ratio(1), background: "#2563eb", radius: 99 },
          }),
        ],
      }),
      Text(
        remainingCount.map(
          (count) => `${count} task${count === 1 ? "" : "s"} left`,
        ),
        {
          style: { color: "#64748b", font: 12 },
        },
      ),
    ],
  });
}
