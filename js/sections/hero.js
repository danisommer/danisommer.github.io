import { t } from "../core/i18n.js";

export function render({ profile }) {
  const hero = document.getElementById("home");

  hero.querySelector(".hero-title").textContent = profile.name;
  hero.querySelector(".hero-subtitle").textContent = t(profile.headline);
  renderLocation(hero.querySelector(".hero-location"), profile.location);
  hero.querySelector(".hero-text").textContent = t(profile.intro);
}

function renderLocation(element, location) {
  element.hidden = !location;
  if (location) element.querySelector("span").textContent = t(location);
}
