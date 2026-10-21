import { h, icon } from "../core/dom.js";
import { label, t } from "../core/i18n.js";
import { arrow, externalLink } from "../core/links.js";

const DEFAULT_ICON = "fas fa-code";
const LINK_TYPES = {
  github: "projects.links.github",
  demo: "projects.links.demo",
};
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  openProject: null,
  trigger: null,
  closing: false,
};

export function setup({ content }) {
  const section = document.getElementById("projects");
  const dialog = document.getElementById("project-modal");
  const findProject = (id) => content.projects.items.find((project) => project.id === id);

  section.addEventListener("click", (event) => {
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
  const [featured, ...others] = projects.items;

  section.querySelector(".projects-feature").replaceChildren(...(featured ? [renderFeature(featured)] : []));
  section
    .querySelector(".projects-index")
    .replaceChildren(...(others.length > 0 ? [renderIndexHead(), ...others.map((project, index) => renderRow(project, index + 2))] : []));

  if (state.openProject) {
    renderModal(document.getElementById("project-modal"), state.openProject);
  }
}

function renderFeature(project) {
  const title = t(project.title);

  return h(
    "article",
    { class: "grid project-feature" },
    project.image &&
      h(
        "figure",
        { class: "project-feature-figure" },
        h("img", { src: project.image, alt: title, loading: "lazy", decoding: "async" })
      ),
    h(
      "div",
      { class: "project-feature-body" },
      h("p", { class: "project-feature-index" }, `01 — ${label("projects.featured")}`),
      h("h3", { class: "project-feature-title" }, title),
      h("p", { class: "project-feature-summary" }, t(project.summary)),
      h(
        "dl",
        { class: "spec" },
        project.status && specRow(label("projects.statusLabel"), statusText(project.status)),
        specRow(label("projects.stack"), project.tags.join(" · "))
      ),
      h("div", { class: "project-feature-links" }, detailsButton(project, "link"), renderLinks(project.links, "link"))
    )
  );
}

function specRow(term, description) {
  return h("div", {}, h("dt", { class: "label" }, term), h("dd", {}, description));
}

function renderIndexHead() {
  return h(
    "div",
    { class: "grid project-index-head", "aria-hidden": "true" },
    ["projects.project", "projects.stack"].map((key) => h("p", { class: "label" }, label(key)))
  );
}

function renderRow(project, number) {
  return h(
    "article",
    { class: "grid project-row" },
    renderThumb(project),
    h(
      "div",
      { class: "project-row-main" },
      h("p", { class: "project-row-n", "aria-hidden": "true" }, String(number).padStart(2, "0")),
      h("h3", {}, detailsButton(project, "project-row-title", t(project.title))),
      h("p", { class: "project-row-summary" }, t(project.summary)),
      project.status && h("p", { class: "project-row-status" }, statusText(project.status))
    ),
    h("ul", { class: "project-row-stack" }, project.tags.map((tag) => h("li", {}, tag))),
    h("div", { class: "project-row-links" }, renderLinks(project.links, "project-row-link"))
  );
}

function renderThumb(project) {
  return h(
    "div",
    { class: project.image ? "project-row-thumb" : "project-row-thumb is-icon", "aria-hidden": "true" },
    project.image
      ? h("img", { src: project.image, alt: "", loading: "lazy", decoding: "async" })
      : icon(project.icon ?? DEFAULT_ICON)
  );
}

function detailsButton(project, className, text) {
  return h(
    "button",
    { type: "button", class: className, "data-project": project.id, "aria-haspopup": "dialog" },
    text ?? [label("projects.details"), arrow("→")]
  );
}

function statusText(status) {
  return h("span", { class: "status" }, label(`projects.status.${status}`));
}

function renderLinks(links, className) {
  return Object.entries(links).map(([type, url]) => {
    if (!Object.hasOwn(LINK_TYPES, type)) {
      console.warn(`Tipo de link "${type}" não suportado (data/projects.json).`);
      return null;
    }
    return externalLink(url, label(LINK_TYPES[type]), className);
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
    await dialog.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: "ease-in" }).finished;
  }

  dialog.close();
  state.closing = false;
}

function renderModal(dialog, project) {
  const title = t(project.title);

  dialog.querySelector(".project-details").replaceChildren(
    h("h2", { id: "project-modal-title" }, title),
    h(
      "p",
      { class: "project-details-meta" },
      project.status && statusText(project.status),
      h("span", {}, project.tags.join(" · "))
    ),
    project.image &&
      h("div", { class: "project-details-img" }, h("img", { src: project.image, alt: title, decoding: "async" })),
    h("div", { class: "project-details-desc" }, renderDescription(project)),
    h("div", { class: "project-details-links" }, renderLinks(project.links, "link"))
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
