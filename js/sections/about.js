import { h } from "../core/dom.js";
import { t } from "../core/i18n.js";

export function render({ profile }) {
  const about = document.getElementById("about");

  renderPhoto(about.querySelector(".about-img"), profile.photo);
  about.querySelector(".about-greeting").textContent = t(profile.about.greeting);
  about.querySelector(".about-text").replaceChildren(
    ...profile.about.paragraphs.map((paragraph) => h("p", {}, t(paragraph)))
  );
  about.querySelector(".about-btn").href = profile.resumeUrl;
}

function renderPhoto(container, photo) {
  const image =
    container.querySelector("img") ??
    container.appendChild(h("img", { loading: "lazy", decoding: "async" }));

  image.src = photo.src;
  image.alt = t(photo.alt);
}
