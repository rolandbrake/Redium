const baseCss = [
  ".r-element{box-sizing:border-box;min-width:0}",
  ".r-container{display:flex;flex-grow:0;flex-shrink:1;align-items:stretch;align-content:stretch;width:100%;max-width:100%}",
  ".r-row{flex-direction:row}",
  ".r-column{flex-direction:column}",
  ".r-wrap{flex-wrap:wrap}",
  ".r-nowrap{flex-wrap:nowrap}",
  ".r-center{justify-content:center;align-items:center}",
  ".r-text{display:block;white-space:normal;overflow-wrap:anywhere}",
  ".r-button{min-width:5rem;min-height:2.75rem;padding:.625rem 1rem;font-family:inherit;font-size:inherit;font-weight:inherit;line-height:1.2;touch-action:manipulation}",
  ".r-control{display:contents}",
  ".r-grid{display:grid;align-items:stretch;justify-items:stretch}",
  ".r-grid-one{grid-template-columns:repeat(1,minmax(0,1fr))}",
  ".r-grid-auto-rows{grid-auto-rows:minmax(min-content,max-content)}",
  ".r-stack{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}",
  //Todo: check this solution in the future
  ".r-root{min-height:100vh;max-width:100vw;max-height:100vh;overflow-x:hidden;overflow-y:auto}",
].join("");

/** Install the stable, component-owned CSS classes once per document. */
export function installBaseStyles(doc: Document): void {
  if (
    [...(doc.head?.children ?? [])].some(
      (node) =>
        node.getAttribute("data-redium-base") !== null ||
        node.getAttribute("data-redium-styles") !== null,
    )
  )
    return;
  const element = doc.createElement("style");
  element.setAttribute("data-redium-base", "");
  element.textContent = baseCss;
  (doc.head ?? doc.body).appendChild(element);
}
