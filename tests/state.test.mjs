import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
for (const [format, api] of [["ESM", await import("redium/state")], ["CommonJS", require("redium/state")]]) {
  const { createState, createSelector } = api;
  test(format + ": subscribers receive changed values and can unsubscribe", () => {
    const value = createState(0), seen = [];
    const stop = value.subscribe((v) => seen.push(v));
    value.value = 1; value.value = 1; stop(); value.value = 2;
    assert.deepEqual(seen, [0, 1]);
  });
  test(format + ": selectors refresh conditional dependencies", () => {
    const gate = createState(true), a = createState(1), b = createState(10);
    let runs = 0;
    const selected = createSelector(() => { runs++; return gate.value ? a.value : b.value; });
    assert.equal(runs, 1);
    gate.value = false; a.value = 2; assert.equal(runs, 2);
    b.value = 11; assert.equal(runs, 3); assert.equal(selected.value, 11);
  });
  test(format + ": nested calculations restore outer tracking", () => {
    const a = createState(1), b = createState(2);
    let inner, runs = 0;
    const result = createSelector(() => { runs++; inner ??= createSelector(() => a.value * 2); return b.value; });
    a.value = 2; assert.equal(runs, 1); assert.equal(inner.value, 4);
    b.value = 3; assert.equal(runs, 2); assert.equal(result.value, 3);
  });
  test(format + ": unchanged derived values do not notify consumers", () => {
    const count = createState(0), even = createSelector(() => count.value % 2 === 0), seen = [];
    even.subscribe((v) => seen.push(v)); count.value = 2; count.value = 3;
    assert.deepEqual(seen, [true, false]);
  });
  test(format + ": failed calculations release partial dependencies", () => {
    const value = createState(0); let runs = 0;
    assert.throws(() => createSelector(() => { runs++; value.value; throw new Error("failed"); }), /failed/);
    value.value = 1; assert.equal(runs, 1);
  });
  test(format + ": mapping computes initially once and follows its source", () => {
    const value = createState(2); let runs = 0;
    const mapped = value.map((v) => { runs++; return v * 2; });
    assert.equal(runs, 1); assert.equal(mapped.value, 4);
    value.value = 3; assert.equal(mapped.value, 6);
  });
}
