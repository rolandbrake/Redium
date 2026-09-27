import { Button, Row } from "redium";
import { Border } from "redium/style";
import { addTask, clearCompleted } from "../state/tasks";

export function Actions() {
  return Row({
    gap: 10,
    children: [
      Button("Add task", {
        onClick: addTask,
        style: {
          background: "#2563eb",
          border: Border(1, "#000"),
          color: "#ffffff",
          radius: 30,
          weight: 700,
        },
      }),
      Button("Clear completed", {
        onClick: clearCompleted,
        style: {
          background: "#f1f5f9",
          border: Border(1, "#000"),
          color: "#334155",
          radius: 30,
          weight: 700,
        },
      }),
    ],
  });
}
