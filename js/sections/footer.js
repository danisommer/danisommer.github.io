import { h, icon } from "../core/dom.js";
import { label, t } from "../core/i18n.js";

export function render({ profile }) {
  const footer = document.querySelector(".site-footer");

  footer.querySelector(".footer-name").textContent = profile.shortName;
  footer.querySelector(".footer-note").textContent = t(profile.footerNote);
  footer.querySelector(".social-links").replaceChildren(
    ...profile.contacts.filter((contact) => contact.social).map(renderSocialLink)
  );
  footer.querySelector(".copyright").textContent = label("footer.copyright", {
    year: new Date().getFullYear(),
    name: profile.name,
  });
}

function renderSocialLink(contact) {
  return h(
    "a",
    {
      href: contact.url,
      class: "social-link",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": t(contact.label),
    },
    icon(contact.icon)
  );
}
