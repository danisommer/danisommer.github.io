import { h, icon } from "../core/dom.js";
import { label, t } from "../core/i18n.js";

const ALL = "all";
const DEFAULT_ICON = "fas fa-code";
const LINK_TYPES = {
  github: { icon: "fab fa-github", label: "projects.links.github" },
  demo: { icon: "fas fa-globe", label: "projects.links.demo" },
};
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  filter: ALL,
  openProject: null,
  trigger: null,
  closing: false,
};

export function setup({ content }) {
  const section = document.getElementById("projects");
  const dialog = document.getElementById("project-modal");
  const findProject = (id) => content.projects.items.find((project) => project.id === id);

  warnUnknownCategories(content.projects);

  section.querySelector(".filter-container").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.filter = button.dataset.filter;
    applyFilter(section);
  });

  section.querySelector(".projects-grid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-project]");
    if (button) openModal(dialog, findProject(button.dataset.project), button);
  });

  dialog.querySelector(".close-modal").addEventListener("click", () => closeModal(dialog));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeModal(dialog);
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal(dialog);
  });
  dialog.addEventListener("close", () => {
    state.openProject = null;
    document.body.classList.remove("is-locked");
    state.trigger?.focus();
  });
}

export function render({ projects }) {
  const section = document.getElementById("projects");

  section.querySelector(".filter-container").replaceChildren(...renderFilters(projects));
  section.querySelector(".projects-grid").replaceChildren(...projects.items.map(renderCard));
  applyFilter(section);

  if (state.openProject) {
    renderModal(document.getElementById("project-modal"), state.openProject);
  }
}

function renderFilters({ categories, items }) {
  const used = new Set(items.flatMap((project) => project.categories));
  const available = categories.filter((category) => used.has(category.id));
  if (available.length === 0) return [];

  return [
    filterButton(ALL, label("projects.filterAll")),
    ...available.map((category) => filterButton(category.id, t(category.label))),
  ];
}

function filterButton(id, text) {
  return h("button", { type: "button", class: "filter-btn", "data-filter": id }, text);
}

function applyFilter(section) {
  for (const button of section.querySelectorAll("[data-filter]")) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === state.filter));
  }
  for (const card of section.querySelectorAll(".project-card")) {
    card.hidden = state.filter !== ALL && !card.dataset.categories.split(" ").includes(state.filter);
  }
}

function renderCard(project) {
  const title = t(project.title);
  const projectIcon = project.icon ?? DEFAULT_ICON;

  return h(
    "article",
    { class: "project-card", "data-categories": project.categories.join(" ") },
    h(
      "div",
      { class: "project-img" },
      project.image
        ? h("img", { src: project.image, alt: title, loading: "lazy", decoding: "async" })
        : icon(projectIcon)
    ),
    h(
      "div",
      { class: "project-content" },
      h("h3", { class: "project-title" }, icon(projectIcon), h("span", {}, title)),
      renderTags(project.tags, "project-tags"),
      h("p", { class: "project-desc" }, t(project.summary)),
      h(
        "div",
        { class: "project-links" },
        h(
          "button",
          { type: "button", class: "project-link", "data-project": project.id, "aria-haspopup": "dialog" },
          icon("fas fa-info-circle"),
          h("span", {}, label("projects.details"))
        ),
        renderLinks(project.links, "project-link")
      )
    )
  );
}

function renderTags(tags, className) {
  return h("div", { class: className }, tags.map((tag) => h("span", { class: "project-tag" }, tag)));
}

function renderLinks(links, className) {
  return Object.entries(links).map(([type, url]) => {
    if (!Object.hasOwn(LINK_TYPES, type)) {
      console.warn(`Tipo de link "${type}" não suportado (data/projects.json).`);
      return null;
    }

    const link = LINK_TYPES[type];
    return h(
      "a",
      { href: url, class: className, target: "_blank", rel: "noopener noreferrer" },
      icon(link.icon),
      h("span", {}, label(link.label))
    );
  });
}

function openModal(dialog, project, trigger) {
  state.openProject = project;
  state.trigger = trigger;

  renderModal(dialog, project);
  document.body.classList.add("is-locked");
  dialog.showModal();
  dialog.querySelector(".modal-content").scrollTop = 0;
}

async function closeModal(dialog) {
  if (!dialog.open || state.closing) return;
  state.closing = true;

  if (!reducedMotion.matches) {
    await dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: "ease-in" }).finished;
  }

  dialog.close();
  state.closing = false;
}

function renderModal(dialog, project) {
  const title = t(project.title);

  dialog.querySelector(".project-details").replaceChildren(
    h("h2", { id: "project-modal-title" }, title),
    project.image &&
      h("div", { class: "project-details-img" }, h("img", { src: project.image, alt: title, decoding: "async" })),
    renderTags(project.tags, "project-details-tags"),
    h("div", { class: "project-details-desc" }, renderDescription(project)),
    h("div", { class: "project-details-links" }, renderLinks(project.links, "btn"))
  );
}

function renderDescription({ details, summary }) {
  if (!details) return h("p", {}, t(summary));

  const { intro, features = [], outro } = details;
  return [
    intro && h("p", {}, t(intro)),
    features.length > 0 && h("p", {}, label("projects.featuresIntro")),
    features.length > 0 && h("ul", {}, features.map((feature) => h("li", {}, t(feature)))),
    outro && h("p", {}, t(outro)),
  ];
}

function warnUnknownCategories({ categories, items }) {
  const known = new Set(categories.map((category) => category.id));

  for (const project of items) {
    project.categories
      .filter((id) => !known.has(id))
      .forEach((id) =>
        console.warn(`Projeto "${project.id}": categoria "${id}" não existe em "categories" (data/projects.json).`)
      );
  }
}
