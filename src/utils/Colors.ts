const browserColorNames = [
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blue", "brown", "coral", "cornflowerblue", "crimson", "cyan", "darkblue", "darkcyan", "darkgray", "darkgreen", "darkgrey", "darkorange", "darkred", "deepskyblue", "dimgray", "dimgrey", "firebrick", "forestgreen", "fuchsia", "gainsboro", "gold", "goldenrod", "gray", "green", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lawngreen", "lemonchiffon", "lightblue", "lightcyan", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightsteelblue", "lime", "limegreen", "linen", "magenta", "maroon", "mediumblue", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "midnightblue", "mintcream", "mistyrose", "moccasin", "navy", "oldlace", "olive", "orange", "orchid", "palegreen", "paleturquoise", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen",
] as const;

const BrowserColors = Object.fromEntries(
  browserColorNames.map((name) => [name, name]),
) as { readonly [Name in (typeof browserColorNames)[number]]: Name };

/** Built-in palette for common UI colors and standard browser color keywords. */
export const Colors = Object.freeze({
  ...BrowserColors,
  white: "#ffffff",
  black: "#000000",

  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",

  gray: "#6b7280",
  slate: "#64748b",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
} as const);

export type BuiltinColor = (typeof Colors)[keyof typeof Colors];
