import { h } from "../core/dom.js";
import { formatNumericPeriod, label, t } from "../core/i18n.js";

const GROUPS = [
  { title: "experience.groups.education", types: ["junior-enterprise", "education"] },
  { title: "experience.groups.other", types: ["volunteering", "courses"] },
];

export function render({ experience }) {
  const { items } = experience;
  const jobs = items.filter((item) => item.type === "work").map((item, index) => renderJob(item, index === 0));
  const groups = GROUPS.map(({ title, types }) => renderGroup(label(title), ofTypes(items, types)));

  document
    .querySelector("#experience .experience-list")
    .replaceChildren(h("div", { class: "jobs" }, jobs), ...groups.filter(Boolean));
}

function ofTypes(items, types) {
  return types.flatMap((type) => items.filter((item) => item.type === type));
}

function renderJob(item, isLead) {
  const highlights = (item.highlights ?? []).map((highlight) => t(highlight));

  return h(
    "article",
    { class: isLead ? "grid job job--lead" : "grid job" },
    h(
      "div",
      { class: "job-meta" },
      h("p", { class: "job-dates" }, formatNumericPeriod(item.start, item.end)),
      item.organization && h("p", { class: "job-org" }, t(item.organization)),
      item.note && h("p", { class: "job-note" }, t(item.note))
    ),
    h(
      "div",
      { class: "job-body" },
      h("h3", { class: "job-role" }, t(item.title)),
      isLead ? leadHighlights(highlights) : pointList("ul", highlights),
      item.stack && h("p", { class: "job-stack" }, item.stack.map((name) => h("span", {}, name)))
    )
  );
}

function leadHighlights([lead, ...rest]) {
  return [lead && h("p", { class: "job-lead" }, lead), pointList("ol", rest)];
}

function pointList(tag, points) {
  if (points.length === 0) return null;
  return h(tag, { class: "job-points" }, points.map((point) => h("li", {}, point)));
}

function renderGroup(title, items) {
  if (items.length === 0) return null;

  return h(
    "div",
    { class: "experience-group" },
    h("h3", { class: "label experience-group-title" }, title),
    items.map(renderRow)
  );
}

function renderRow(item) {
  const highlights = item.highlights ?? [];

  return h(
    "div",
    { class: "grid experience-row" },
    h("p", { class: "experience-row-dates" }, formatNumericPeriod(item.start, item.end)),
    h(
      "div",
      { class: "experience-row-body" },
      h("h4", { class: "experience-row-title" }, t(item.title), item.organization && h("span", {}, ` · ${t(item.organization)}`)),
      highlights.length > 0 &&
        h(
          "ul",
          { class: highlights.length > 3 ? "experience-row-text is-list" : "experience-row-text" },
          highlights.map((highlight) => h("li", {}, t(highlight)))
        )
    )
  );
}
