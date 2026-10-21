import { h } from "../core/dom.js";
import { formatNumericPeriod, label, t } from "../core/i18n.js";
import { contactLink, cvLink, featuredContacts } from "../core/links.js";

const ONGOING_TYPES = ["work", "junior-enterprise"];

export function render({ profile, experience }) {
  const hero = document.getElementById("home");

  hero.querySelector(".hero-kicker").textContent = t(profile.headline);
  hero.querySelector(".hero-name").textContent = profile.name;
  hero.querySelector(".hero-lede").textContent = t(profile.intro);
  renderPortrait(hero.querySelector(".hero-portrait"), profile.portrait);
  renderFocus(hero.querySelector(".hero-focus"), profile.focus);
  hero.querySelector(".hero-actions").replaceChildren(
    cvLink(profile, "btn"),
    ...featuredContacts(profile).map((contact) => contactLink(contact, "link"))
  );
  hero.querySelector(".hero-facts").replaceChildren(...facts(profile, experience.items));
}

function renderPortrait(container, portrait) {
  container.hidden = !portrait;
  if (!portrait) return;

  const image =
    container.querySelector("img") ??
    container.appendChild(h("img", { decoding: "async", fetchpriority: "high" }));

  image.src = portrait.src;
  image.alt = t(portrait.alt);
}

function renderFocus(container, focus = []) {
  container.hidden = focus.length === 0;
  container.querySelector("ul").replaceChildren(...focus.map((item) => h("li", {}, t(item))));
}

function facts(profile, items) {
  const current = items.find((item) => ONGOING_TYPES.includes(item.type) && !item.end);
  const previous = items.find((item) => item.type === "work" && item.end);
  const education = items.find((item) => item.type === "education");

  return [
    current && fact(label("hero.now"), t(current.organization), t(current.title)),
    previous &&
      fact(
        label("hero.before"),
        t(previous.organization),
        t(previous.title),
        formatNumericPeriod(previous.start, previous.end)
      ),
    education && fact(label("hero.education"), t(education.title), formatNumericPeriod(education.start, education.end)),
    profile.location && fact(label("hero.base"), t(profile.location)),
  ].filter(Boolean);
}

function fact(term, value, ...details) {
  return h(
    "div",
    { class: "fact" },
    h("dt", { class: "label" }, term),
    h("dd", { class: "fact-value" }, value),
    details.map((detail) => h("dd", { class: "fact-detail" }, detail))
  );
}
