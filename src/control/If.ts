import { Element } from "../core/Element.js";
import { State } from "../state/State.js";
import { ControlElement } from "./Control.js";

type Branch = () => Element;

class IfElement extends ControlElement {
  private branch: Element | undefined;
  private branchValue: boolean | undefined;

  constructor(
    condition: State<boolean>,
    private readonly whenTrue: Branch,
    private readonly whenFalse?: Branch,
  ) {
    super();
    this.onMount(() => condition.subscribe((value) => this.update(value)));
  }

  private update(value: boolean): void {
    if (this.branchValue === value) return;
    this.branch?.dispose();
    this.branch = (value ? this.whenTrue : this.whenFalse)?.();
    this.branchValue = value;
    if (this.branch) this.add(this.branch);
  }
}

/** Render one branch for a reactive boolean condition. */
export function If(
  condition: State<boolean>,
  whenTrue: Branch,
  whenFalse?: Branch,
): Element {
  return new IfElement(condition, whenTrue, whenFalse);
}
