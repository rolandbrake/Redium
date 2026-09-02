import {
  Root,
  Column,
  Row,
  Container,
  Color,
  Text,
  Button,
  state,
  createSelector,
  mountElement,
} from "../src/index.js";

function ResponsiveExample() {
  const count = state(0);

  return Root({
    body: Container({
        padding: 24,
        style: {
          background: "#111827",
          color: Color.white,
          radius: 16,
          width: 0.99,
        },

        children: [
          // Header
          Row({
            // gap: 16,
            children: [
              Text("Responsive Container", {
                style: {
                  width: 0.6,
                  font: 28,
                  weight: 700,
                },
              }),

              Button("Click Me", {
                onClick: () => {
                  count.value += 1;
                },
                style: {
                  width: 0.4,
                  background: Color.blue,
                  color: Color.white,
                },
              }),
            ],
          }),

          // Description
          Container({
            padding: 16,
            style: {
              background: Color.gray,
              radius: 10,
            },
            children: [
              Text(
                "This is a responsive test container. Resize the browser window and observe how the elements behave when the available space becomes smaller.",
                {
                  style: {
                    font: 16,
                  },
                },
              ),
            ],
          }),

          // Three columns
          Row({
            gap: 16,
            children: [
              Container({
                padding: 20,
                style: {
                  width: 0.33,
                  background: Color.red,
                  radius: 12,
                  color: Color.white,
                },
                children: [
                  Text("Card One", {
                    style: {
                      font: 20,
                      weight: 700,
                    },
                  }),
                  Text(
                    "This card contains some text that should test how text behaves inside a shrinking container.",
                    {
                      style: {
                        font: 14,
                      },
                    },
                  ),
                ],
              }),

              Container({
                padding: 20,
                style: {
                  width: 0.34,
                  background: Color.green,
                  radius: 12,
                  color: Color.white,
                },
                children: [
                  Text("Card Two", {
                    style: {
                      font: 20,
                      weight: 700,
                    },
                  }),
                  Text(
                    "Another piece of content with a different amount of text to test responsive sizing.",
                    {
                      style: {
                        font: 14,
                      },
                    },
                  ),
                ],
              }),

              Container({
                padding: 20,
                style: {
                  width: 0.33,
                  background: Color.purple,
                  radius: 12,
                  color: Color.white,
                },
                children: [
                  Text("Card Three", {
                    style: {
                      font: 20,
                      weight: 700,
                    },
                  }),
                  Text(
                    "This third card is here specifically to see what happens when three percentage-width elements no longer comfortably fit.",
                    {
                      style: {
                        font: 14,
                      },
                    },
                  ),
                ],
              }),
            ],
          }),

          // Large content block
          Container({
            padding: 20,
            style: {
              background: Color.gray,
              radius: 12,
            },
            children: [
              Text("Long Content Test", {
                style: {
                  font: 22,
                  weight: 700,
                },
              }),

              Text(
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
                  "Praesent commodo, neque vel tincidunt malesuada, " +
                  "justo lorem consequat purus, vitae tincidunt nisl " +
                  "nunc sed lorem. Resize the window to test wrapping, " +
                  "overflow, and the behavior of nested elements.",
                {
                  style: {
                    font: 16,
                  },
                },
              ),

              Row({
                gap: 12,
                children: [
                  Button("Button One", {
                    onClick: () => {},
                    style: {
                      width: 0.25,
                      background: Color.purple,
                      color: Color.white,
                    },
                  }),

                  Button("Button Two With More Text", {
                    onClick: () => {},
                    style: {
                      width: 0.4,
                      background: Color.pink,
                      color: Color.white,
                    },
                  }),

                  Button("Button Three", {
                    onClick: () => {},
                    style: {
                      width: 0.35,
                      background: Color.orange,
                      color: Color.white,
                    },
                  }),
                ],
              }),
            ],
          }),

          // Nested responsive section
          Row({
            gap: 16,
            children: [
              Container({
                padding: 20,
                style: {
                  width: 0.7,
                  background: Color.amber,
                  color: Color.gray,
                  radius: 12,
                },
                children: [
                  Text("70% Width Section", {
                    style: {
                      font: 20,
                      weight: 700,
                    },
                  }),
                  Text(
                    "This section intentionally takes most of the available width.",
                  ),
                ],
              }),

              Container({
                padding: 20,
                style: {
                  width: 0.3,
                  background: Color.cyan,
                  color: Color.gray,
                  radius: 12,
                },
                children: [
                  Text("30%", {
                    style: {
                      font: 20,
                      weight: 700,
                    },
                  }),
                  Text("Small section"),
                ],
              }),
            ],
          }),

          // State test
          Container({
            padding: 20,
            style: {
              background: Color.purple,
              radius: 12,
            },
            children: [
              Text(
                createSelector(() => `Button clicks: ${count.value}`),
                {
                  style: {
                    font: 18,
                    weight: 700,
                  },
                },
              ),
            ],
          }),
        ],
      }),
  });
}

export const page = mountElement(ResponsiveExample);
