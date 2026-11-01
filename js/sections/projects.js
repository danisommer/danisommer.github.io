import { h, icon } from "../core/dom.js";
import { label, t } from "../core/i18n.js";
import { arrow, externalLink } from "../core/links.js";

const DEFAULT_ICON = "fas fa-code";
const LINK_TYPES = {
  github: "projects.links.github",
  demo: "projects.links.demo",
  video: "projects.links.video",
  download: "projects.links.download",
};
const PREVIEW_VISIBLE_RATIO = 0.5;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  openProject: null,
  trigger: null,
  closing: false,
  preview: null,
};

const previewObserver = new IntersectionObserver(onPreviewIntersection, { threshold: [0, PREVIEW_VISIBLE_RATIO] });

export function setup({ content }) {
  const section = document.getElementById("projects");
  const dialog = document.getElementById("project-modal");
  const findProject = (id) => content.projects.items.find((project) => project.id === id);

  section.addEventListener("click", (event) => {
    if (event.target.closest(".project-feature-play")) {
      startPreviewOnRequest();
      return;
    }
    const button = event.target.closest("[data-project]");
    if (button) openModal(dialog, findProject(button.dataset.project), button);
  });

  dialog.querySelector(".close-modal").addEventListener("click", () => closeModal(dialog));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeModal(dialog);
    else if (event.target.closest("[data-play-video]")) playModalVideo(dialog);
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeModal(dialog);
  });
  dialog.addEventListener("close", () => {
    dialog.querySelector(".project-details-video video")?.pause();
    state.openProject = null;
    document.body.classList.remove("is-locked");
    state.trigger?.focus();
    syncPreview();
  });

  document.addEventListener("visibilitychange", syncPreview);
  reducedMotion.addEventListener("change", syncPreview);
}

export function render({ projects }) {
  const section = document.getElementById("projects");
  const [featured, ...others] = projects.items;

  section.querySelector(".projects-feature").replaceChildren(...(featured ? [renderFeature(featured)] : []));
  watchPreview(section.querySelector(".project-feature-preview"));
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
    renderFeatureMedia(project, title),
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
      h("div", { class: "project-feature-links" }, detailsButton(project, "link"), renderLinks(project, "link"))
    )
  );
}

function renderFeatureMedia(project, title) {
  if (project.media?.preview) return renderFeaturePreview(project);
  if (project.image) {
    return h(
      "figure",
      { class: "project-feature-figure" },
      h("img", { src: project.image, alt: title, loading: "lazy", decoding: "async" })
    );
  }
  return null;
}

function renderFeaturePreview({ id, media }) {
  const video = h("video", {
    class: "project-feature-video",
    src: media.preview,
    poster: media.poster,
    muted: true,
    loop: true,
    playsinline: true,
    preload: "none",
    tabindex: "-1",
    "aria-hidden": "true",
    "data-project": id,
    "data-play-video": true,
  });
  video.muted = true;

  return h(
    "figure",
    { class: "project-feature-figure project-feature-preview" },
    video,
    h(
      "button",
      { type: "button", class: "project-feature-play", "aria-label": label("projects.media.play"), hidden: true },
      icon("fas fa-play")
    )
  );
}

function watchPreview(figure) {
  previewObserver.disconnect();
  state.preview = figure ? createPreview(figure) : null;
  if (figure) previewObserver.observe(figure);
}

function createPreview(figure) {
  const preview = {
    figure,
    video: figure.querySelector("video"),
    button: figure.querySelector(".project-feature-play"),
    visible: false,
    requested: false,
    blocked: false,
    failed: false,
  };
  const update = () => updatePreviewButton(preview);
  preview.video.addEventListener("play", update);
  preview.video.addEventListener("pause", update);
  update();
  return preview;
}

function onPreviewIntersection(entries) {
  const entry = entries.findLast(({ target }) => target === state.preview?.figure);
  if (!entry) return;
  state.preview.visible = entry.intersectionRatio >= PREVIEW_VISIBLE_RATIO;
  syncPreview();
}

function syncPreview() {
  const { preview } = state;
  if (!preview || preview.failed) return;

  if (!canShowPreview(preview)) preview.requested = false;
  if (shouldPlayPreview(preview)) playPreview(preview);
  else preview.video.pause();
  updatePreviewButton(preview);
}

function startPreviewOnRequest() {
  state.preview.requested = true;
  playPreview(state.preview);
}

function shouldPlayPreview(preview) {
  return canShowPreview(preview) && (preview.requested || !needsManualStart(preview));
}

function canShowPreview(preview) {
  return preview.visible && document.visibilityState === "visible" && state.openProject === null;
}

function needsManualStart(preview) {
  return reducedMotion.matches || preview.blocked;
}

function playPreview(preview) {
  preview.video.play().catch((error) => onPreviewPlayError(preview, error));
}

function onPreviewPlayError(preview, error) {
  switch (error.name) {
    case "AbortError":
      return;
    case "NotAllowedError":
      preview.blocked = true;
      updatePreviewButton(preview);
      return;
    default:
      preview.failed = true;
      updatePreviewButton(preview);
      console.error(`Não foi possível tocar a prévia "${preview.video.getAttribute("src")}":`, error);
  }
}

function updatePreviewButton(preview) {
  preview.button.hidden = preview.failed || !needsManualStart(preview) || !preview.video.paused;
}

function specRow(term, description) {
  return h("div", {}, h("dt", { class: "label" }, term), h("dd", {}, description));
}

function renderIndexHead() {
  return h(
    "div",
    { class: "grid project-index-head", "aria-hidden": "true" },
    h("p", { class: "label" }, label("projects.project"))
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
      h(
        "p",
        { class: "project-row-n" },
        h("span", { "aria-hidden": "true" }, String(number).padStart(2, "0")),
        project.status && statusText(project.status)
      ),
      h("h3", {}, detailsButton(project, "project-row-title", t(project.title))),
      h("p", { class: "project-row-summary" }, t(project.summary)),
      h("p", { class: "project-row-stack" }, project.tags.join(" · "))
    ),
    h("div", { class: "project-row-links" }, renderLinks(project, "project-row-link"))
  );
}

function renderThumb(project) {
  return h(
    "div",
    { class: project.image ? "project-row-thumb" : "project-row-thumb is-icon" },
    project.image
      ? h("img", { src: project.image, alt: "", loading: "lazy", decoding: "async" })
      : icon(project.icon ?? DEFAULT_ICON),
    project.media &&
      h(
        "span",
        { class: "project-row-thumb-play", role: "img", "aria-label": label("projects.media.hasVideo") },
        icon("fas fa-play")
      )
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

function renderLinks(project, className, videoButton = openVideoButton) {
  const { links, media } = project;

  Object.keys(links)
    .filter((type) => !Object.hasOwn(LINK_TYPES, type))
    .forEach((type) => console.warn(`Tipo de link "${type}" não suportado (data/projects.json).`));

  return Object.entries(LINK_TYPES).map(([type, labelKey]) => {
    if (type === "video" && media) return videoButton(project, label(labelKey), className);
    if (Object.hasOwn(links, type)) return externalLink(links[type], label(labelKey), className);
    return null;
  });
}

function openVideoButton(project, text, className) {
  return h(
    "button",
    { type: "button", class: className, "data-project": project.id, "data-play-video": true, "aria-haspopup": "dialog" },
    text,
    arrow("→")
  );
}

function playVideoButton(project, text, className) {
  return h("button", { type: "button", class: className, "data-play-video": true }, text, arrow("→"));
}

function openModal(dialog, project, trigger) {
  state.openProject = project;
  state.trigger = trigger;

  renderModal(dialog, project);
  document.body.classList.add("is-locked");
  dialog.showModal();
  dialog.querySelector(".modal-content").scrollTop = 0;
  syncPreview();

  if (trigger.hasAttribute("data-play-video")) playModalVideo(dialog);
}

function playModalVideo(dialog) {
  const video = dialog.querySelector(".project-details-video video");
  video.focus();
  video.play().catch((error) => onModalPlayError(video, error));
}

function onModalPlayError(video, error) {
  switch (error.name) {
    case "AbortError":
    case "NotAllowedError":
      return;
    default:
      console.error(`Não foi possível tocar o vídeo "${video.getAttribute("src")}":`, error);
  }
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
    ...(project.media ? [renderModalVideo(project, title)] : []),
    project.image &&
      h("div", { class: "project-details-img" }, h("img", { src: project.image, alt: title, decoding: "async" })),
    h("div", { class: "project-details-desc" }, renderDescription(project)),
    h("div", { class: "project-details-links" }, renderLinks(project, "link", playVideoButton))
  );
}

function renderModalVideo({ media }, title) {
  return h(
    "div",
    { class: "project-details-video" },
    h("video", {
      src: media.video,
      poster: media.poster,
      controls: true,
      playsinline: true,
      preload: "none",
      "aria-label": label("projects.media.video", { title }),
    })
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
