import { ContainerElement, } from "../elements/Container.js";
export class Cell extends ContainerElement {
    constructor(options = {}) {
        super(options);
        if (options.column !== undefined)
            this.style.raw("grid-column", typeof options.column === "number"
                ? `span ${options.column}`
                : options.column);
        if (options.row !== undefined)
            this.style.raw("grid-row", typeof options.row === "number" ? `span ${options.row}` : options.row);
    }
}
