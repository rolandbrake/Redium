import {
  Button,
  Border,
  Colors,
  Center,
  Column,
  Root,
  Row,
  Text,
  createState,
  createSelector,
  mountElement,
} from "redium";

const cookies = createState(0);
const message = createSelector(() => "Cookies in the box: " + cookies.value);

const card = Column({
    padding: 24,
    gap: 16,
    style: { background: "azure", maxWidth: 440, radius: 24, border: Border(1, Colors.black) },
    children: [
      Text("The cookie box", { style: { font: 28, weight: 700 } }),
      Text(message),
      Row({
        gap: 8,
        children: [
          Button("Add a cookie", { style: { background: "aquamarine", radius: 50, border: Border(1, Colors.black) }, onClick: () => cookies.value++ }),
          Button("Reset", {
            style: { background: "antiquewhite", radius: 50, border: Border(1, Colors.black) },
            onClick: () => {
              cookies.value = 0;
            },
          }),
        ],
      }),
    ],
  });

mountElement(
  Root(Center(card, { padding: 16 }), { style: { background: "aliceblue" } }),
);
