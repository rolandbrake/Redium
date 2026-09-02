/** Values that can be used by dimensions and CSS sizing functions. */
export type Relative = number;
export type Absolute = number;
export type SizeValue = number | CSSFunction | string;
export type CSSFunction = string;
export declare function px(value: number): string;
export declare function ratio(value: number): string;
/** Converts a dimension number: 0..1 is relative, values above 1 are pixels. */
export declare function dimension(value: SizeValue, property?: string): string;
/** Converts a value whose unit is always logical CSS pixels. */
export declare function pixels(value: number, property?: string, allowNegative?: boolean): string;
/** Converts the framework's absolute font size to rem using the 16px root. */
export declare function fontSize(value: number): string;
export declare function opacity(value: number): string;
export declare function min(...values: SizeValue[]): CSSFunction;
export declare function max(...values: SizeValue[]): CSSFunction;
export declare function clamp(minimum: SizeValue, preferred: SizeValue, maximum: SizeValue): CSSFunction;
//# sourceMappingURL=Size.d.ts.map