import { h } from "../core/dom.js";
import { t } from "../core/i18n.js";

export function render({ skills }) {
  const { categories, levels } = skills;

  document
    .querySelector("#skills .skills-list")
    .replaceChildren(...categories.map((category) => renderCategory(category, levels)));
}

function renderCategory(category, levels) {
  return h(
    "div",
    { class: "grid skills-row" },
    h("dt", { class: "label skills-category" }, t(category.title)),
    h(
      "dd",
      { class: "skills-items" },
      h(
        "ul",
        {},
        category.items.map((skill) =>
          h("li", {}, t(skill.name), skill.level && h("span", { class: "skill-level" }, levelLabel(skill.level, levels)))
        )
      )
    )
  );
}

function levelLabel(level, levels) {
  if (Object.hasOwn(levels, level)) return t(levels[level]);
  console.warn(`Nível "${level}" não existe em "levels" (data/skills.json).`);
  return level;
}
