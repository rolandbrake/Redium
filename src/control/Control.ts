import { Element } from "../core/Element.js";
import { styles } from "../style/Style.js";

/** A layout-neutral host for elements that manage their own child branches. */
export abstract class ControlElement extends Element {
  protected override readonly canContainChildren = true;

  protected constructor() {
    super("span");
    styles(this.style).default("display", "contents");
  }
}
