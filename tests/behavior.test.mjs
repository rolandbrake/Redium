import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { dom, css, cssNode } from "./dom.mjs";
const require = createRequire(import.meta.url);

for (const [format, load] of [
  ["ESM", (name) => import(name)],
  ["CommonJS", (name) => require(name)],
]) {
  const api = await load("redium");
  const {
    Node,
    Container,
    Row,
    Column,
    Grid,
    Root,
    Stack,
    Text,
    Button,
    Style,
    Unit,
    Border,
    Colors,
    If,
    For,
  } = api;
  function children(parent, expected) {
    assert.deepEqual(parent.children, expected);
    for (const child of expected) assert.equal(child.parent, parent);
    if (typeof parent.mount === "function") {
      const browserChildren = expected.filter(
        (child) => typeof child.mount === "function",
      );
      assert.deepEqual(dom(parent).children, browserChildren.map(dom));
    }
  }

  for (const method of ["add", "addFirst"]) {
    test(
      format + ": " + method + " rejects cycles before moving any nodes",
      () => {
        const top = Container(),
          middle = Container(),
          bottom = Container();
        top.add(middle);
        middle.add(bottom);
        const incoming = Text("incoming"),
          source = Container({ children: [incoming] });
        for (const invalid of [top, middle, bottom]) {
          for (const batch of [
            [incoming, invalid],
            [invalid, incoming],
          ]) {
            assert.throws(() => bottom[method](...batch), /cannot contain/);
            children(top, [middle]);
            children(middle, [bottom]);
            children(bottom, []);
            children(source, [incoming]);
          }
        }
      },
    );
    test(
      format + ": " + method + " reparents and reorders without duplicates",
      () => {
        const a = Text("a"),
          b = Text("b"),
          branch = Container({ children: [b] });
        const parent = Container({ children: [a, branch] });
        parent[method](b);
        children(branch, []);
        children(parent, method === "add" ? [a, branch, b] : [b, a, branch]);
        parent[method](b, b);
        children(parent, method === "add" ? [a, branch, b] : [b, a, branch]);
        const destination = Container();
        destination[method](b);
        children(destination, [b]);
        children(parent, [a, branch]);
        assert.throws(() => Text("leaf")[method](a), /cannot contain children/);
      },
    );
  }
  test(
    format + ": prepending respects argument order and nonvisual nodes",
    () => {
      const a = Text("a"),
        b = Text("b"),
        c = Text("c");
      const logical = new (class extends Node {})();
      const parent = Container();
      parent.add(logical, c);
      parent.addFirst(a, b);
      children(parent, [a, b, logical, c]);
      parent.remove(a);
      assert.equal(a.parent, null);
      assert.equal(dom(a).parentElement, null);
      parent.removeAll();
      children(parent, []);
    },
  );
  test(
    format + ": unmount pauses state bindings and remount refreshes them",
    () => {
      const count = api.createState(0),
        text = Text(count);
      const parent = Container({ children: [text] });
      parent.mountElement(document.createElement("div"));
      count.value = 1;
      assert.equal(text.text, "1");
      text.unmount();
      children(parent, []);
      count.value = 2;
      assert.equal(text.text, "1");
      parent.add(text);
      children(parent, [text]);
      assert.equal(text.text, "2");
      parent.dispose();
    },
  );
  test(
    format + ": lifecycle setup, cleanup, and disposal follow tree ownership",
    () => {
      const events = [],
        child = Text("child", {
          onMount: () => {
            events.push("mount");
            return () => events.push("unmount");
          },
          onDispose: () => events.push("dispose"),
        });
      const parent = Container({ children: [child] });
      parent.mountElement(document.createElement("div"));
      child.unmount();
      parent.add(child);
      parent.dispose();
      assert.deepEqual(events, [
        "mount",
        "unmount",
        "mount",
        "unmount",
        "dispose",
      ]);
      assert.equal(child.isDisposed, true);
      assert.throws(
        () => child.mountElement(document.createElement("div")),
        /disposed/,
      );
    },
  );
  test(
    format +
      ": If creates only the active branch and disposes replaced branches",
    () => {
      const visible = api.createState(false),
        created = [];
      const branch = If(
        visible,
        () => {
          const view = Text("first");
          created.push(view);
          return view;
        },
        () => {
          const view = Text("second");
          created.push(view);
          return view;
        },
      );
      const parent = Container({ children: [branch] });
      const target = document.createElement("div");
      parent.mountElement(target);
      assert.equal(created.length, 1);
      assert.equal(
        target.children[0].children[0].children[0].textContent,
        "second",
      );
      visible.value = true;
      assert.equal(created.length, 2);
      assert.equal(created[0].isDisposed, true);
      assert.equal(
        target.children[0].children[0].children[0].textContent,
        "first",
      );
      parent.dispose();
      assert.equal(created[1].isDisposed, true);
    },
  );
  test(
    format +
      ": For preserves keyed branches while updating and reordering items",
    () => {
      const users = api.createState([
        { id: "ali", name: "Ali" },
        { id: "sara", name: "Sara" },
        { id: "john", name: "John" },
      ]);
      const views = new Map();
      const list = For(
        users,
        (user) => {
          const view = Text(api.createSelector(() => user.value.name));
          views.set(user.value.id, view);
          return view;
        },
        { key: (user) => user.id },
      );
      const parent = Container({ children: [list] });
      const target = document.createElement("div");
      parent.mountElement(target);
      const listDom = target.children[0].children[0];
      const aliDom = listDom.children[0],
        saraDom = listDom.children[1];
      users.value = [
        { id: "sara", name: "Sarah" },
        { id: "ali", name: "Ali" },
        { id: "john", name: "John" },
      ];
      assert.deepEqual(
        listDom.children.map((child) => child.textContent),
        ["Sarah", "Ali", "John"],
      );
      assert.strictEqual(listDom.children[0], saraDom);
      assert.strictEqual(listDom.children[1], aliDom);
      assert.throws(() => {
        users.value = [
          { id: "sara", name: "Sarah" },
          { id: "sara", name: "Duplicate" },
        ];
      }, /duplicate key/);
      users.value = [{ id: "sara", name: "Sarah" }];
      assert.equal(views.get("ali").isDisposed, true);
      assert.equal(views.get("john").isDisposed, true);
      parent.dispose();
      assert.equal(views.get("sara").isDisposed, true);
    },
  );
  test(format + ": Stack layers children and disposes popped layers", () => {
    const events = [];
    const base = Text("base", { onDispose: () => events.push("base") });
    const dialog = Text("dialog", { onDispose: () => events.push("dialog") });
    const stack = Stack({ children: [base] });
    const target = document.createElement("div");
    stack.mountElement(target);
    stack.push(dialog);
    const stackDom = target.children[0];
    assert.equal(cssNode(stackDom, "display"), "grid");
    assert.equal(cssNode(stackDom.children[0], "grid-area"), "1 / 1");
    assert.equal(cssNode(stackDom.children[0], "z-index"), "0");
    assert.equal(cssNode(stackDom.children[1], "z-index"), "1");
    assert.equal(stack.peek(), dialog);
    assert.equal(stack.pop(), dialog);
    assert.equal(dialog.isDisposed, true);
    assert.deepEqual(events, ["dialog"]);
    assert.equal(stack.peek(), base);
    stack.clear();
    assert.equal(base.isDisposed, true);
    assert.deepEqual(events, ["dialog", "base"]);
  });
  test(format + ": layout defaults remain specialized", () => {
    const row = Row(),
      column = Column(),
      container = Container(),
      grid = Grid({ columns: 3, minColumnWidth: 180, gap: 16 });
    assert.equal(css(row, "flex-direction"), "row");
    assert.equal(css(row, "flex-wrap"), "wrap");
    assert.equal(css(column, "flex-direction"), "column");
    assert.equal(css(column, "flex-wrap"), "nowrap");
    assert.equal(css(container, "display"), "flex");
    assert.equal(css(grid, "display"), "grid");
    assert.equal(css(grid, "gap"), "16px");
    assert.match(css(grid, "grid-template-columns"), /auto-fit/);
    assert.throws(() => Grid({ columns: 0 }), /positive integer/);
    assert.equal(css(Root(Container()), "height"), "100vh");
  });
  test(
    format + ": sizing, spacing, and borders preserve explicit options",
    () => {
      const box = Container({
        width: 200,
        padding: [Unit.px(12), Unit.rem(1)],
        gap: Unit.rem(1),
        style: { border: Border(Unit.px(1), Colors.black) },
      });
      assert.equal(css(box, "width"), "200px");
      assert.equal(css(box, "padding"), "12px 1rem");
      assert.equal(css(box, "gap"), "1rem");
      assert.equal(css(box, "border"), "1px solid #000000");
      assert.throws(
        () => Container({ padding: "16px" }),
        /finite number|absolute unit/,
      );
    },
  );
  test(format + ": shared appearance never changes sibling layouts", () => {
    const shared = new Style().color("red");
    const row = Row({ style: shared }),
      column = Column({ style: shared }),
      grid = Grid({ style: shared });
    shared.color("green");
    row.style.color("blue");
    assert.equal(css(row, "color"), "blue");
    assert.equal(css(column, "color"), "green");
    assert.equal(css(row, "flex-direction"), "row");
    assert.equal(css(column, "flex-direction"), "column");
    assert.equal(css(grid, "display"), "grid");
    const block = Container({ style: new Style().center() });
    assert.equal(css(block, "display"), "grid");
  });
  test(
    format +
      ": styles are private reusable classes and dynamic changes replace them",
    () => {
      const shared = new Style({ color: "red" });
      const first = Text("first", { style: shared, className: "author-class" });
      const second = Text("second", { style: shared });
      const firstDom = dom(first),
        secondDom = dom(second);
      const initial = firstDom.className
        .split(" ")
        .find((name) => !["author-class", "r-element", "r-text"].includes(name));
      assert.ok(initial);
      assert.equal(
        secondDom.className.split(" ").find((name) => name.startsWith("r-")),
        initial,
      );
      assert.match(firstDom.className, /author-class/);
      assert.equal(firstDom.style.getPropertyValue("color"), "");
      shared.color("blue");
      const updated = firstDom.className
        .split(" ")
        .find((name) => !["author-class", "r-element", "r-text"].includes(name));
      assert.notEqual(updated, initial);
      assert.equal(css(first, "color"), "blue");
    },
  );
  test(format + ": elements expose stable base classes and DevTools markers", () => {
    const browserNode = dom(Container());
    assert.match(browserNode.className, /r-container/);
    assert.equal(browserNode.getAttribute("data-redium"), "container");
    assert.match(browserNode.getAttribute("data-redium-id"), /^r\d+$/);
  });
  test(
    format + ": buttons connect actions and reactive text/disabled values",
    () => {
      const count = api.createState(0),
        disabled = api.createState(false);
      const button = Button(count, { disabled, onClick: () => count.value++ });
      const target = document.createElement("div");
      button.mountElement(target);
      target.children[0].dispatchEvent({ type: "click" });
      assert.equal(button.text, "1");
      disabled.value = true;
      assert.equal(button.disabled, true);
      assert.equal(css(Text("long content"), "overflow-wrap"), "anywhere");
      assert.equal(css(Container({ style: { zIndex: 4 } }), "z-index"), "4");
      assert.throws(() => new Style().zIndex(1.5), /integer/);
      button.dispose();
    },
  );
  test(format + ": package subpaths share runtime identity", async () => {
    for (const path of [
      "core",
      "render",
      "control",
      "elements",
      "state",
      "store",
      "style",
      "colors",
    ]) {
      const sub = await load("redium/" + path);
      const esm = await import("redium/" + path);
      assert.deepEqual(Object.keys(sub).sort(), Object.keys(esm).sort());
      for (const name of Object.keys(sub))
        assert.strictEqual(sub[name], api[name]);
    }
    const state = await load("redium/state"),
      styling = await load("redium/style");
    const count = state.createState(1);
    const text = Text(api.createSelector(() => count.value * 2));
    text.mountElement(document.createElement("div"));
    count.value = 3;
    assert.equal(text.text, "6");
    text.dispose();
    assert.equal(css(Container({ width: 1 }), "width"), "1px");
    assert.equal(css(Container({ width: 0.5 }), "width"), "50%");
    assert.equal(css(Container({ width: Unit.ratio(1) }), "width"), "100%");
    assert.equal(css(api.Center(Text("Centered")), "width"), "100%");
    assert.equal(
      css(Container({ style: new Style().fill() }), "height"),
      "100%",
    );
    assert.equal(
      css(
        Container({
          style: new Style().width(styling.min(styling.ratio(1), 320)),
        }),
        "width",
      ),
      "min(100%, 320px)",
    );
  });
}
