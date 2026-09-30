import { h, icon } from "../core/dom.js";
import { label, t } from "../core/i18n.js";

const STATUS_MESSAGES = {
  success: "contact.form.success",
  error: "contact.form.error",
};

let status = "idle";

export function setup() {
  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    send(form);
  });

  form.addEventListener("input", () => {
    if (status === "success" || status === "error") setStatus("idle");
  });
}

export function render({ profile }) {
  document.querySelector("#contact .contact-list").replaceChildren(...profile.contacts.map(renderContact));
  renderStatus();
}

function renderContact(contact) {
  const external = !contact.url.startsWith("mailto:");

  return h(
    "li",
    { class: "contact-item" },
    h("div", { class: "contact-icon" }, icon(contact.icon)),
    h(
      "div",
      { class: "contact-details" },
      h("h4", {}, t(contact.label)),
      h(
        "p",
        {},
        h(
          "a",
          { href: contact.url, target: external && "_blank", rel: external && "noopener noreferrer" },
          contact.text
        )
      )
    )
  );
}

async function send(form) {
  if (status === "sending") return;
  setStatus("sending");

  let response;
  try {
    response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    console.error("Falha de rede ao enviar o formulário de contato:", error);
    setStatus("error");
    return;
  }

  if (response.ok) {
    form.reset();
    setStatus("success");
    return;
  }

  console.warn(
    `O Formspree recusou o envio em segundo plano (HTTP ${response.status}); usando o envio padrão do formulário.`,
    await response.text()
  );
  form.submit();
}

function setStatus(next) {
  status = next;
  renderStatus();
}

function renderStatus() {
  const form = document.getElementById("contact-form");
  const button = form.querySelector('[type="submit"]');
  const message = form.querySelector(".form-status");
  const messageKey = STATUS_MESSAGES[status];

  button.disabled = status === "sending";
  button.textContent = label(status === "sending" ? "contact.form.sending" : "contact.form.submit");
  message.textContent = messageKey ? label(messageKey) : "";
  message.dataset.status = status;
}
