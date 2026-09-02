import { State } from "./State.js";
/**
 * Theme holds a set of design tokens (colors, spacing, radii, whatever
 * the app defines) as one reactive value. Swapping themes — light/dark,
 * brand A/B, whatever — is a single `.set()` call, and every Style that
 * registered via `.themed()` re-runs automatically. This is the
 * abstracted replacement for CSS custom properties / `prefers-color-scheme`.
 */
export class Theme {
    constructor(initial) {
        this.state = new State(initial);
    }
    get tokens() {
        return this.state.value;
    }
    /** Replace the whole token set (e.g. switching from `light` to `dark`). */
    set(next) {
        this.state.value = next;
    }
    /** Patch a subset of tokens, keeping the rest. */
    update(patch) {
        this.state.value = { ...this.state.value, ...patch };
    }
    /** Run `fn` now and every time the theme changes. */
    onChange(fn) {
        return this.state.subscribe(fn);
    }
}
