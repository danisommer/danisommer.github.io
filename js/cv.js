import { loadContent } from "./core/content.js";
import { h } from "./core/dom.js";
import {
  formatNumericPeriod,
  isSupportedLanguage,
  label,
  overrideLanguage,
  setDictionary,
  t,
  translateDocument,
} from "./core/i18n.js";

start();

async function start() {
  applyLanguageParam();

  let content;
  try {
    content = await loadContent();
  } catch (error) {
    console.error(error);
    document.querySelector(".cv").replaceChildren(h("p", { class: "cv-error" }, error.message));
    return;
  }

  setDictionary(content.ui);
  translateDocument();
  document.title = label("cv.documentTitle", { name: content.profile.name });
  document.querySelector(".cv").replaceChildren(...renderCv(content));
  document.documentElement.dataset.cvReady = "true";
}

function applyLanguageParam() {
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (requested === null) return;
  if (isSupportedLanguage(requested)) {
    overrideLanguage(requested);
    return;
  }
  console.warn(`Idioma não suportado em ?lang=: ${requested}`);
}

function renderCv({ profile, experience, skills, projects }) {
  const ofType = (type) => experience.items.filter((item) => item.type === type);

  return [
    renderHeader(profile),
    section(label("cv.summary"), [h("p", {}, t(profile.intro))]),
    section(label("cv.experience"), ofType("work").map(renderEntry)),
    section(label("cv.education"), ofType("education").map(renderEntry)),
    section(label("cv.projects"), cvProjects(projects.items).map(renderProject)),
    section(label("cv.skills"), [renderSkills(skills)]),
  ].filter(Boolean);
}

function cvProjects(items) {
  return items.filter((project) => project.cv !== undefined).sort((a, b) => a.cv - b.cv);
}

function renderHeader(profile) {
  const contacts = profile.contacts.map((contact) => h("a", { href: contact.url }, contact.text.replace(/^www\./, "")));
  const details = [profile.location && t(profile.location), ...contacts].filter(Boolean);

  return h(
    "header",
    { class: "cv-header" },
    h("h1", {}, profile.name),
    h("p", { class: "cv-headline" }, t(profile.headline)),
    h("p", { class: "cv-contacts" }, joinWith(details, " · "))
  );
}

function section(title, children) {
  if (children.length === 0) return null;
  return h("section", { class: "cv-section" }, h("h2", {}, title), children);
}

function renderEntry(item) {
  const highlights = item.highlights ?? [];

  return h(
    "article",
    { class: "cv-entry" },
    entryHead(item),
    highlights.length > 0 && h("ul", {}, highlights.map((highlight) => h("li", {}, t(highlight))))
  );
}

function entryHead({ title, organization, start, end }) {
  return h(
    "div",
    { class: "cv-entry-head" },
    h("h3", {}, t(title), organization && h("span", { class: "cv-org" }, ` · ${t(organization)}`)),
    h("span", { class: "cv-date" }, formatNumericPeriod(start, end))
  );
}

function renderProject(project) {
  const links = [
    project.links.github && h("a", { href: project.links.github }, label("projects.links.github")),
    project.links.demo && h("a", { href: project.links.demo }, label("cv.demo")),
  ].filter(Boolean);

  return h(
    "article",
    { class: "cv-entry" },
    h(
      "div",
      { class: "cv-entry-head" },
      h("h3", {}, t(project.title), h("span", { class: "cv-tech" }, ` · ${project.tags.join(", ")}`)),
      links.length > 0 && h("span", { class: "cv-links" }, joinWith(links, " · "))
    ),
    h("p", {}, t(project.cvSummary ?? project.summary))
  );
}

function renderSkills({ categories, levels }) {
  return h(
    "ul",
    { class: "cv-skills" },
    categories.map((category) =>
      h(
        "li",
        {},
        h("strong", {}, `${t(category.title)}: `),
        category.items.map((skill) => skillText(skill, levels)).join(", ")
      )
    )
  );
}

function skillText(skill, levels) {
  const name = t(skill.name);
  if (skill.level === undefined) return name;
  return `${name} (${t(levels[skill.level])})`;
}

function joinWith(nodes, separator) {
  return nodes.flatMap((node, index) => (index === 0 ? [node] : [separator, node]));
}
