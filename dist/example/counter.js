import { Column, Row, Text, Button, createState, createSelector, mountElement, min, } from "redium";
export function Counter() {
    const count = createState(0);
    const doubled = createSelector(() => count.value * 2);
    const card = Column({
        gap: 20,
        padding: 28,
        style: {
            width: min(0.99, 400),
            background: "#ffffff",
            radius: 20,
            shadow: "lg",
        },
        children: [
            Text("COUNTER", {
                style: { font: 13, weight: 700, color: "#64748b" },
            }),
            Text(count, { style: { font: 64, weight: 700, color: "#0f172a" } }),
            Text(doubled.map((value) => `Double: ${value}`), {
                style: { font: 15, color: "#64748b" },
            }),
            Row({
                gap: 12,
                center: true,
                style: { width: 0.99 },
                children: [
                    Button("−", {
                        style: {
                            width: 56,
                            height: 48,
                            radius: 12,
                            background: "#e2e8f0",
                            color: "#0f172a",
                            font: 24,
                            weight: 700,
                            cursor: "pointer",
                        },
                        onClick: () => count.value--,
                    }), // Button
                    Button("Reset", {
                        style: {
                            width: 96,
                            height: 48,
                            radius: 12,
                            background: "#f8fafc",
                            color: "#475569",
                            font: 14,
                            weight: 700,
                            cursor: "pointer",
                        },
                        onClick: () => (count.value = 0),
                    }), // Button
                    Button("+", {
                        style: {
                            width: 56,
                            height: 48,
                            radius: 12,
                            background: "#2563eb",
                            color: "#ffffff",
                            font: 24,
                            weight: 700,
                            cursor: "pointer",
                        },
                        onClick: () => count.value++,
                    }), // Button
                ],
            }), // Row
        ],
    }); // Column
    card.style.raw("align-items", "center").raw("text-align", "center");
    return card;
}
export function AppView() {
    return Column({
        center: true,
        minHeight: 0.999,
        padding: [24, 16],
        gap: 24,
        style: { background: "#f1f5f9", color: "#0f172a" },
        children: [
            Text("A tiny reactive state demo", {
                style: { font: 16, weight: 700, color: "#475569" },
            }),
            Counter(),
            Text("Click the buttons to update the value", {
                style: { font: 13, color: "#94a3b8" },
            }),
        ],
    });
}
const page = mountElement(AppView);
export { page };
