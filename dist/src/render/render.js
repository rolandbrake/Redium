/** Creates a view and mounts it when a browser host is available. */
export function mountElement(view, target) {
    const element = typeof view === "function" ? view() : view;
    if (typeof document !== "undefined")
        element.mount(target ?? document.body);
    return element;
}
