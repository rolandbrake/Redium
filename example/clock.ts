import {
  Button,
  Column,
  Row,
  Text,
  createState,
  createSelector,
  mountElement,
} from "redium";

function Clock() {
  const seconds = createState(0);
  const label = createSelector(() => `${seconds.value}s elapsed`);
  return Column({
    gap: 12,
    padding: 20,
    style: { background: "#ffffff", radius: 12 },
    children: [
      Text("Mount-scoped clock", { style: { font: 20, weight: 700 } }),
      Text(label, { style: { font: 32, weight: 700 } }),
    ],
    onMount: () => {
      const timer = window.setInterval(() => seconds.value++, 1_000);
      return () => window.clearInterval(timer);
    },
  });
}

export default function LifecyclePage() {
  const message = createState("The clock is visible and ticking.");
  const controlsDisabled = createState(false);

  const clock = Clock();
  const stage = Column({
    gap: 12,
  });

  const showClock = () => {
    if (clock.isDisposed) {
      message.value = "This clock was disposed and cannot be shown again.";
      return;
    }

    if (!clock.isMounted) {
      stage.add(clock);
    }

    message.value = "The clock is visible and ticking.";
  };

  const hideClock = () => {
    if (clock.isDisposed) {
      message.value = "This clock was disposed and cannot be hidden again.";
      return;
    }

    clock.unmount();

    message.value = "The clock is hidden; its timer is stopped.";
  };

  const disposeClock = () => {
    if (clock.isDisposed) return;

    clock.dispose();

    controlsDisabled.value = true;
    message.value = "The clock was disposed permanently.";
  };

  return Column({
    gap: 16,
    padding: 24,
    style: {
      background: "#f1f5f9",
      minHeight: 1,
    },
    children: [
      Text("Element lifecycle", {
        style: {
          font: 28,
          weight: 700,
        },
      }),

      Text(message, {
        style: {
          color: "#475569",
        },
      }),

      Row({
        gap: 8,
        children: [
          Button("Show", {
            onClick: showClock,
            disabled: controlsDisabled,
          }),

          Button("Hide", {
            onClick: hideClock,
            disabled: controlsDisabled,
          }),

          Button("Dispose", {
            onClick: disposeClock,
            disabled: controlsDisabled,
          }),
        ],
      }), 

      stage,
    ],
    onMount: () => {
      showClock();
      return disposeClock
    },
  });
}

mountElement(LifecyclePage);
