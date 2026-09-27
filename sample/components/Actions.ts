import { Button, Row } from "redium";
import { addTask, clearCompleted } from "../state/tasks";

export function Actions() {
  return Row({
    gap: 10,
    children: [
      Button("Add task", {
        onClick: addTask,
        style: {
          background: "#2563eb",
          color: "#ffffff",
          radius: 10,
          weight: 700,
        },
      }),
      Button("Clear completed", {
        onClick: clearCompleted,
        style: {
          background: "#f1f5f9",
          color: "#334155",
          radius: 10,
          weight: 700,
        },
      }),
    ],
  });
}
