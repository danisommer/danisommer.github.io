import { h } from "../core/dom.js";
import { formatPeriod, t } from "../core/i18n.js";

export function render({ experience }) {
  document.querySelector("#experience .timeline").replaceChildren(...experience.items.map(renderItem));
}

function renderItem({ title, organization, start, end, highlights = [] }) {
  return h(
    "li",
    { class: "timeline-item" },
    h(
      "div",
      { class: "timeline-content" },
      h("h3", {}, t(title)),
      h("p", { class: "timeline-date" }, formatPeriod(start, end)),
      organization && h("p", {}, t(organization)),
      highlights.length > 0 && h("ul", {}, highlights.map((highlight) => h("li", {}, t(highlight))))
    )
  );
}
