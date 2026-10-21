import { h } from "../core/dom.js";
import { t } from "../core/i18n.js";
import { cvLink } from "../core/links.js";

export function render({ profile }) {
  const about = document.getElementById("about");

  about.querySelector(".about-text").replaceChildren(...profile.about.paragraphs.map((paragraph) => h("p", {}, t(paragraph))));
  about.querySelector(".about-actions").replaceChildren(cvLink(profile, "link"));
}
