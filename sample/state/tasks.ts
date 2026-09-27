import { createSelector, createState } from "redium";

export interface Task {
  id: number;
  title: string;
  detail: string;
  done: boolean;
}

export const tasks = createState<Task[]>([
  {
    id: 1,
    title: "Sketch the home screen",
    detail: "Keep the first pass intentionally small.",
    done: true,
  },
  {
    id: 2,
    title: "Write the welcome copy",
    detail: "Explain the value in one clear paragraph.",
    done: false,
  },
  {
    id: 3,
    title: "Share a preview",
    detail: "Send the link to the design channel.",
    done: false,
  },
]);

export const completedCount = createSelector(
  () => tasks.value.filter((task) => task.done).length,
);
export const remainingCount = createSelector(
  () => tasks.value.length - completedCount.value,
);
export const progress = createSelector(() => {
  const total = tasks.value.length;
  return total === 0
    ? "No tasks yet"
    : `${completedCount.value} of ${total} complete`;
});

let nextId = 4;

export function toggleTask(id: number): void {
  tasks.value = tasks.value.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task,
  );
}

export function addTask(): void {
  tasks.value = [
    ...tasks.value,
    {
      id: nextId++,
      title: "Plan the next small step",
      detail: "Add a task, then mark it done when it is ready.",
      done: false,
    },
  ];
}

export function clearCompleted(): void {
  tasks.value = tasks.value.filter((task) => !task.done);
}
