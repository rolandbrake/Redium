export type UnitKind = "px" | "ratio" | "rem";

/** A framework-created measurement value. Raw CSS unit strings are not accepted. */
export interface UnitValue {
  readonly kind: "unit";
  readonly unit: UnitKind;
  readonly value: number;
}

function create(unit: UnitKind, value: number): UnitValue {
  if (!Number.isFinite(value)) throw new Error("Unit value must be a finite number.");
  if (value < 0) throw new Error(`${unit} value cannot be negative.`);
  return Object.freeze({ kind: "unit", unit, value });
}

export const Unit = Object.freeze({
  px(value: number): UnitValue {
    return create("px", value);
  },
  ratio(value: number): UnitValue {
    if (value > 1) throw new Error("Relative value must be between 0 and 1.");
    return create("ratio", value);
  },
  rem(value: number): UnitValue {
    return create("rem", value);
  },
});
