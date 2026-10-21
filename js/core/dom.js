/**
 * Cria um elemento: h("a", { href: "#", class: "btn" }, "texto", filho).
 * Textos viram nós de texto (nunca HTML); filhos null, false ou "" são ignorados; arrays são achatados.
 */
export function h(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);

  for (const [name, value] of Object.entries(attributes)) {
    setAttribute(element, name, value);
  }

  element.append(...children.flat(Infinity).filter(isRenderable));
  return element;
}

function setAttribute(element, name, value) {
  if (value === null || value === undefined || value === false) return;
  if (name === "class") {
    element.className = value;
    return;
  }
  element.setAttribute(name, value === true ? "" : String(value));
}

function isRenderable(child) {
  return child !== null && child !== undefined && child !== false && child !== "";
}
