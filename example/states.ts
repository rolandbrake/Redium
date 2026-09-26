import {
  Button,
  Column,
  Row,
  Text,
  createState,
  createSelector,
  mountElement,
} from "redium";

const cookies = createState(0);
const message = createSelector(() => "Cookies in the box: " + cookies.value);

mountElement(
  Column({
    padding: 24,
    gap: 16,
    children: [
      Text("The cookie box", { style: { font: 28, weight: 700 } }),
      Text(message),
      Row({
        gap: 8,
        children: [
          Button("Add a cookie", { onClick: () => cookies.value++ }),
          Button("Reset", {
            onClick: () => {
              cookies.value = 0;
            },
          }),
        ],
      }),
    ],
  }),
);
