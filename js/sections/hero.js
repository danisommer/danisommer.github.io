import { h } from "../core/dom.js";
import { t } from "../core/i18n.js";

export function render({ profile }) {
  const hero = document.getElementById("home");

  hero.querySelector(".hero-title").textContent = profile.name;
  hero.querySelector(".hero-subtitle").textContent = t(profile.headline);
  renderLocation(hero.querySelector(".hero-location"), profile.location);
  hero.querySelector(".hero-text").textContent = t(profile.intro);
  renderPortrait(hero.querySelector(".hero-portrait"), profile.portrait);
}

function renderLocation(element, location) {
  element.hidden = !location;
  if (location) element.querySelector("span").textContent = t(location);
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
