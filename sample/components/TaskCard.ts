import { Button, Column, Row, Text, Border } from "redium";
import type { State } from "redium";
import { toggleTask, type Task } from "../state/tasks";

export function TaskCard(task: State<Task>) {
  const title = task.map((value) => value.title);
  const detail = task.map((value) => value.detail);
  const action = task.map((value) => (value.done ? "Reopen" : "Complete"));
  const status = task.map((value) => (value.done ? "Done" : "In progress"));

  return Row({
    gap: 16,
    padding: 16,
    style: {
      background: "#ffffff",
      border: { kind: "border", width: 1, style: "solid", color: "#e2e8f0" },
      radius: 14,
    },
    children: [
      Column({
        gap: 5,
        grow: 1,
        children: [
          Text(title, { style: { color: "#0f172a", font: 16, weight: 700 } }),
          Text(detail, { style: { color: "#64748b", font: 13 } }),
          Text(status, { style: { color: "#2563eb", font: 12, weight: 700 } }),
        ],
      }),
      Button(action, {
        onClick: () => toggleTask(task.value.id),
        style: {
          background: "#eff6ff",
          border: Border(1, "#000"),
          color: "#1d4ed8",
          radius: 10,
          weight: 700,
        },
      }),
    ],
  }); // Row 
}
