import { ContainerElement } from "../elements/Container.js";
/** The single application root. Its only child is the supplied body container. */
export class RootElement extends ContainerElement {
    constructor(options) {
        super(options);
        this.body = options.body;
        super.add(this.body);
        this.style
            .raw("width", "100vw")
            .raw("height", "100vh")
            .raw("max-width", "100vw")
            .raw("max-height", "100vh")
            .raw("min-width", "0")
            .raw("min-height", "0")
            .raw("overflow-x", "hidden")
            .raw("overflow-y", "auto");
    }
    /** Add application content to Root.body, keeping Root's hierarchy fixed. */
    add(...nodes) {
        this.body.add(...nodes);
        return this;
    }
    mount(target = document.body) { return super.mount(target); }
}
export const Root = function (options) { return new RootElement(options); };
