import { Node } from "./Node.js";
import { Style, styles, type StyleConfig } from "../style/Style.js";
import { createDOM, domOf } from "./_dom.js";

export interface ElementOptions {
  style?: Style | StyleConfig;
  id?: string;
  className?: string;
  /** Setup when mounted. The returned cleanup runs on unmount or disposal. */
  onMount?: MountSetup;
  /** Final one-time cleanup after descendants dispose. */
  onDispose?: LifecycleCleanup;
}

export type LifecycleCleanup = () => void;
export type MountSetup = () => void | LifecycleCleanup;

/** A visual element. Browser details stay inside the renderer. */
export abstract class Element extends Node {
  readonly style: Style;
  protected readonly canContainChildren: boolean = false;
  private mounted = false;
  private disposed = false;
  private readonly mountSetups = new Map<
    MountSetup,
    LifecycleCleanup | undefined
  >();
  private readonly disposeCallbacks = new Set<LifecycleCleanup>();

  protected constructor(tag: string, options: ElementOptions = {}) {
    super();
    const dom = createDOM(this, tag);
    this.style =
      options.style instanceof Style
        ? styles(options.style).fork()
        : new Style(options.style);

    if (options.id) dom.id = options.id;
    if (options.className) dom.className = options.className;
    styles(this.style)
      .default("box-sizing", "border-box")
      .default("min-width", "0");
    // Finish the shared base style before registering a DOM target. This avoids
    // emitting a transient class for an element that is still being created.
    styles(this.style).bind(dom);
    if (options.onMount) this.onMount(options.onMount);
    if (options.onDispose) this.onDispose(options.onDispose);
  }
  override add(...nodes: Node[]): this {
    this.assertUsable();
    this.assertChildrenUsable(nodes);
    if (!this.canContainChildren && nodes.length)
      throw new Error(this.constructor.name + " cannot contain children.");
    return super.add(...nodes);
  }
  override addFirst(...nodes: Node[]): this {
    this.assertUsable();
    this.assertChildrenUsable(nodes);
    if (!this.canContainChildren && nodes.length)
      throw new Error(this.constructor.name + " cannot contain children.");
    return super.addFirst(...nodes);
  }

  /** True while this element belongs to a live mounted tree. */
  get isMounted(): boolean {
    return this.mounted;
  }

  /** True after final cleanup. Disposed elements cannot be mounted again. */
  get isDisposed(): boolean {
    return this.disposed;
  }

  /** Run setup for every mount; its returned cleanup runs on unmount. */
  onMount(setup: MountSetup): this {
    this.assertUsable();
    this.mountSetups.set(setup, undefined);
    if (this.mounted) this.runMountSetup(setup);
    return this;
  }

  /** Run a final one-time callback after this element's descendants dispose. */
  onDispose(cleanup: LifecycleCleanup): this {
    this.assertUsable();
    this.disposeCallbacks.add(cleanup);
    return this;
  }

  /** Detach this element from the live DOM. It may be mounted again later. */
  unmount(): this {
    return this.unmountElement();
  }

  /** Permanently release this element and all descendants. */
  dispose(): this {
    if (this.disposed) return this;
    this.unmountElement();
    for (const child of [...this.children].reverse()) {
      if (child instanceof Element) child.dispose();
      else this.remove(child);
    }
    this.disposed = true;
    const callbacks = [...this.disposeCallbacks].reverse();
    this.disposeCallbacks.clear();
    callbacks.forEach((callback) => callback());
    return this;
  }

  protected onChildAdded(node: Node): void {
    if (!(node instanceof Element)) return;
    const dom = domOf(this);
    if (this.children[this.children.length - 1] === node) {
      dom.appendChild(domOf(node));
    } else {
      const next = this.children
        .slice(this.children.indexOf(node) + 1)
        .find(
          (child): child is Element =>
            child instanceof Element && domOf(child).parentElement === dom,
        );
      dom.insertBefore(domOf(node), next ? domOf(next) : null);
    }
    if (this.mounted) node.mountTree();
  }
  protected onChildRemoved(node: Node): void {
    if (!(node instanceof Element)) return;
    node.unmountTree();
    if (domOf(node).parentElement === domOf(this))
      domOf(this).removeChild(domOf(node));
  }
  onClick(fn: () => void): this {
    this.assertUsable();
    domOf(this).addEventListener("click", fn);
    return this;
  }
  mountElement(target: HTMLElement = document.body): this {
    this.assertUsable();
    // The production CSS extractor evaluates the entry to construct its view,
    // but must never run application lifecycle work while doing so.
    if (
      (globalThis as typeof globalThis & { __REDIUM_EXTRACTING__?: boolean })
        .__REDIUM_EXTRACTING__
    )
      return this;
    this.parent?.remove(this);
    target.appendChild(domOf(this));
    this.mountTree();
    return this;
  }
  unmountElement(): this {
    this.assertUsable();
    if (this.parent) this.parent.remove(this);
    else {
      this.unmountTree();
      domOf(this).parentElement?.removeChild(domOf(this));
    }
    return this;
  }

  private mountTree(): void {
    if (this.mounted) return;
    this.assertUsable();
    this.mounted = true;
    try {
      for (const setup of this.mountSetups.keys()) this.runMountSetup(setup);
      for (const child of this.children)
        if (child instanceof Element) child.mountTree();
    } catch (error) {
      this.unmountTree();
      throw error;
    }
  }

  private unmountTree(): void {
    if (!this.mounted) return;
    for (const child of [...this.children].reverse())
      if (child instanceof Element) child.unmountTree();
    for (const cleanup of [...this.mountSetups.values()].reverse()) cleanup?.();
    for (const setup of this.mountSetups.keys())
      this.mountSetups.set(setup, undefined);
    this.mounted = false;
  }

  private runMountSetup(setup: MountSetup): void {
    const cleanup = setup();
    this.mountSetups.set(setup, cleanup ?? undefined);
  }

  private assertUsable(): void {
    if (this.disposed) throw new Error("Cannot use a disposed element.");
  }

  private assertChildrenUsable(nodes: Node[]): void {
    for (const node of nodes)
      if (node instanceof Element && node.disposed)
        throw new Error("Cannot add a disposed element.");
  }
}
