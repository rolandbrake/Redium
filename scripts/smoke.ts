import "./dom-stub";
import { body, FakeElement } from "./dom-stub";

async function main() {
  const { page } = await import("../example/counter");
  console.assert(
    page.parent === null && body.children.length === 1,
    "view should mount once under body",
  );
  const dom = page.dom.children[0] as unknown as FakeElement;
  dom.dispatchEvent("click");
  console.assert(
    dom.textContent === "Clicked!",
    "declarative click handler should run",
  );
  console.log("SMOKE TEST PASSED");
}
main().catch((error) => {
  console.error("SMOKE TEST FAILED", error);
  throw error;
});
