const RESEND_ENDPOINT = "https://api.resend.com/emails";
const HONEYPOT_FIELD = "_gotcha";

const FIELDS = {
  name: { max: 100 },
  email: { max: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  subject: { max: 200 },
  message: { max: 5000 },
};

export default {
  async fetch(request, env) {
    if (request.headers.get("Origin") !== env.ALLOWED_ORIGIN) return reply(env, 403, { error: "origin_not_allowed" });
    if (request.method !== "POST") return reply(env, 405, { error: "method_not_allowed" });

    const form = await request.formData().catch(() => null);
    if (form === null) return reply(env, 400, { error: "invalid_body" });

    if (form.get(HONEYPOT_FIELD)) {
      console.log("Envio descartado: o campo-armadilha veio preenchido.");
      return reply(env, 200, { ok: true });
    }

    const fields = readFields(form);
    const invalid = Object.keys(FIELDS).filter((field) => !isValid(fields[field], FIELDS[field]));
    if (invalid.length > 0) return reply(env, 422, { error: "invalid_fields", fields: invalid });

    const response = await sendEmail(env, fields);
    if (!response.ok) {
      console.error(`O Resend recusou o envio (HTTP ${response.status}):`, await response.text());
      return reply(env, 502, { error: "send_failed" });
    }

    return reply(env, 200, { ok: true });
  },
};

function readFields(form) {
  return Object.fromEntries(Object.keys(FIELDS).map((field) => [field, readText(form.get(field))]));
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isValid(value, { max, pattern }) {
  return value.length > 0 && value.length <= max && (pattern?.test(value) ?? true);
}

function sendEmail(env, { name, email, subject, message }) {
  return fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `[Portfólio] ${subject}`,
      text: `${name} <${email}> escreveu pelo formulário do portfólio:\n\n${message}`,
    }),
  });
}

function reply(env, status, body) {
  return Response.json(body, { status, headers: { "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN } });
}
