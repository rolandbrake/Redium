import { Container, Center, Root, Text, mountElement } from "../src/index.js";
function Test() {
  return Root({
    body: Center(Text("Hello World")),
  });
}

export const page = mountElement(Test);
