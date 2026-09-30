import { t } from "../core/i18n.js";

export function render({ profile }) {
  const hero = document.getElementById("home");

  hero.querySelector(".hero-title").textContent = profile.name;
  hero.querySelector(".hero-subtitle").textContent = t(profile.headline);
  hero.querySelector(".hero-text").textContent = t(profile.intro);
}
