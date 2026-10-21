import { label, t } from "../core/i18n.js";
import { contactLink, featuredContacts } from "../core/links.js";

export function render({ profile }) {
  const footer = document.querySelector(".site-footer");

  footer.querySelector(".footer-name").textContent = profile.shortName;
  footer.querySelector(".footer-note").textContent = t(profile.footerNote);
  footer
    .querySelector(".footer-links")
    .replaceChildren(...featuredContacts(profile).map((contact) => contactLink(contact, "link")));
  footer.querySelector(".copyright").textContent = label("footer.copyright", {
    year: new Date().getFullYear(),
    name: profile.name,
  });
}
