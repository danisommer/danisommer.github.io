import { h } from "../core/dom.js";
import { getLanguage, label, t } from "../core/i18n.js";

export function render({ profile }) {
  const about = document.getElementById("about");

  renderPhoto(about.querySelector(".about-img"), profile.photo);
  about.querySelector(".about-greeting").textContent = t(profile.about.greeting);
  about.querySelector(".about-text").replaceChildren(
    ...profile.about.paragraphs.map((paragraph) => h("p", {}, t(paragraph)))
  );
  renderCvLink(about.querySelector(".about-btn"), profile);
}

function renderPhoto(container, photo) {
  const image =
    container.querySelector("img") ??
    container.appendChild(h("img", { loading: "lazy", decoding: "async" }));

  image.src = photo.src;
  image.alt = t(photo.alt);
}

function renderCvLink(link, profile) {
  link.href = `cv/${getLanguage()}.pdf`;
  link.download = label("cv.fileName", { name: profile.name });
}
