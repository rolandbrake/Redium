import { State } from "./State.js";
/**
 * Screen replaces CSS media queries. It exposes width/height as State so
 * any Style can re-run its rules whenever the viewport changes — see
 * Style.responsive(). There is exactly one Screen (the real browser
 * viewport), accessed as the exported `screen` singleton.
 */
export class Screen {
    static get instance() {
        if (!Screen._instance)
            Screen._instance = new Screen();
        return Screen._instance;
    }
    constructor() {
        const hasWindow = typeof window !== "undefined";
        this.width = new State(hasWindow ? window.innerWidth : 1024);
        this.height = new State(hasWindow ? window.innerHeight : 768);
        if (hasWindow) {
            window.addEventListener("resize", () => {
                this.width.value = window.innerWidth;
                this.height.value = window.innerHeight;
            });
        }
    }
    isMobile() {
        return this.width.value < 640;
    }
    isTablet() {
        return this.width.value >= 640 && this.width.value < 1024;
    }
    isDesktop() {
        return this.width.value >= 1024;
    }
    /** Run `fn` now and again every time the viewport changes. */
    onChange(fn) {
        const unsubW = this.width.subscribe(() => fn());
        const unsubH = this.height.subscribe(() => fn());
        return () => {
            unsubW();
            unsubH();
        };
    }
}
Screen._instance = null;
export const screen = Screen.instance;
