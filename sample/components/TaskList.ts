import { Column, For, If, Text, createSelector } from "redium";
import { TaskCard } from "./TaskCard";
import { tasks } from "../state/tasks";

export function TaskList() {
  const hasTasks = createSelector(() => tasks.value.length > 0);
  return Column({
    gap: 12,
    children: [
      Text("Tasks", { style: { color: "#0f172a", font: 18, weight: 700 } }),
      If(
        hasTasks,
        () => For(tasks, (task) => TaskCard(task), { key: (task) => task.id }),
        () => Text("You are all caught up.", { style: { color: "#64748b" } }),
      ),
    ],
  });
}
