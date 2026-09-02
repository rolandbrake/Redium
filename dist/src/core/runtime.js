export function mountElement(view, target = document.body) {
    const element = typeof view === "function" ? view() : view;
    element.mount(target);
    return element;
}
