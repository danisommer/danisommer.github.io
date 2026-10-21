import { h } from "./dom.js";
import { getLanguage, label, t } from "./i18n.js";

/** Link de download do currículo em PDF no idioma atual (cv/pt.pdf ou cv/en.pdf). */
export function cvLink(profile, className) {
  return h(
    "a",
    { class: className, href: `cv/${getLanguage()}.pdf`, download: label("cv.fileName", { name: profile.name }) },
    label("cv.download"),
    arrow("↓")
  );
}

/** Contatos marcados com "featured": topo, seção Contato e rodapé. */
export function featuredContacts(profile) {
  return profile.contacts.filter((contact) => contact.featured);
}

export function isEmail(contact) {
  return contact.url.startsWith("mailto:");
}

/** Link de contato: e-mail mostra o endereço; os demais abrem em nova aba e mostram o nome (ou o texto informado). */
export function contactLink(contact, className, text) {
  if (isEmail(contact)) return h("a", { class: className, href: contact.url }, text ?? contact.text);
  return externalLink(contact.url, text ?? t(contact.label), className);
}

/** Link que abre em nova aba, com a seta ↗. */
export function externalLink(href, text, className) {
  return h("a", { class: className, href, target: "_blank", rel: "noopener noreferrer" }, text, arrow("↗"));
}

/** Seta tipográfica decorativa, oculta para leitores de tela. */
export function arrow(symbol) {
  return h("span", { class: "arrow", "aria-hidden": "true" }, symbol);
}
