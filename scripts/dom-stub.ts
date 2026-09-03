/**
 * A deliberately minimal fake `document`/`window` - just enough surface
 * area (createElement, appendChild, style.setProperty, addEventListener,
 * dispatchEvent) for the framework to run its real logic without an
 * actual browser. This is NOT a replacement for testing in a real
 * browser - it exists only to sanity-check that the framework's own
 * code doesn't throw. For real projects, use jsdom/happy-dom + Vitest.
 */
class FakeStyle {
  private props = new Map<string, string>();
  setProperty(k: string, v: string) {
    this.props.set(k, v);
  }
  removeProperty(k: string) {
    this.props.delete(k);
  }
  get(k: string) {
    return this.props.get(k);
  }
}

export class FakeElement {
  tagName: string;
  style = new FakeStyle();
  children: FakeElement[] = [];
  parentElement: FakeElement | null = null;
  id = "";
  className = "";
  private _text = "";
  private listeners = new Map<string, Set<(payload?: unknown) => void>>();
  private attrs = new Map<string, string>();

  constructor(tag: string) {
    this.tagName = tag.toUpperCase();
  }

  get textContent() {
    return this._text;
  }
  set textContent(v: string) {
    this._text = v;
  }

  appendChild(child: FakeElement) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }
  removeChild(child: FakeElement) {
    this.children = this.children.filter((c) => c !== child);
    child.parentElement = null;
    return child;
  }
  addEventListener(type: string, fn: (payload?: unknown) => void) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type)!.add(fn);
  }
  removeEventListener(type: string, fn: (payload?: unknown) => void) {
    this.listeners.get(type)?.delete(fn);
  }
  /** Not a real Event - just enough to trigger listeners for the smoke test. */
  dispatchEvent(type: string, payload: unknown = {}) {
    this.listeners.get(type)?.forEach((fn) => fn(payload));
  }
  setAttribute(k: string, v: string) {
    this.attrs.set(k, v);
  }
  getAttribute(k: string) {
    return this.attrs.get(k) ?? null;
  }
}

const body = new FakeElement("body");

(globalThis as Record<string, unknown>).document = {
  createElement: (tag: string) => new FakeElement(tag),
  body,
};

(globalThis as Record<string, unknown>).window = {
  innerWidth: 1280,
  innerHeight: 800,
  addEventListener: () => {},
  removeEventListener: () => {},
};

export { body };
