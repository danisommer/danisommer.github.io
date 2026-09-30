import { readPreference, savePreference } from "./storage.js";

const LOCALES = { pt: "pt-BR", en: "en" };
const FALLBACK_LANGUAGE = "pt";
const STORAGE_KEY = "language";
const DATE_PATTERN = /^(\d{4})(?:-(0[1-9]|1[0-2]))?$/;
const LONG_MONTH = { month: "long", year: "numeric" };
const NUMERIC_MONTH = { month: "2-digit", year: "numeric" };

let language = initialLanguage();
let dictionary = {};

/** Idioma atual: "pt" ou "en". */
export function getLanguage() {
  return language;
}

/** true se o valor é um idioma suportado ("pt" ou "en"). */
export function isSupportedLanguage(value) {
  return typeof value === "string" && Object.hasOwn(LOCALES, value);
}

/** Usa o idioma nesta página sem memorizá-lo (ex.: cv.html?lang=en). */
export function overrideLanguage(next) {
  if (!isSupportedLanguage(next)) {
    throw new Error(`Idioma não suportado: ${next}`);
  }
  language = next;
}

/** Troca o idioma por escolha do visitante e memoriza a escolha. */
export function setLanguage(next) {
  overrideLanguage(next);
  savePreference(STORAGE_KEY, next);
}

/** Define os rótulos da interface (conteúdo de data/ui.json). */
export function setDictionary(ui) {
  dictionary = ui;
}

/** Resolve um texto do conteúdo: string vale para os dois idiomas; { pt, en } usa o idioma atual (ou pt, com aviso no console). */
export function t(text) {
  if (typeof text === "string") return text;
  if (typeof text?.[language] === "string") return text[language];
  if (typeof text?.[FALLBACK_LANGUAGE] === "string") {
    console.warn(`Tradução "${language}" ausente; exibindo "${FALLBACK_LANGUAGE}":`, text);
    return text[FALLBACK_LANGUAGE];
  }
  console.error("Texto inválido no conteúdo:", text);
  return "";
}

/** Rótulo de data/ui.json pelo caminho (ex.: "projects.details"), com {marcadores} preenchidos por values. */
export function label(key, values = {}) {
  const entry = key.split(".").reduce((node, part) => node?.[part], dictionary);
  if (entry === undefined) {
    console.warn(`Rótulo ausente em data/ui.json: ${key}`);
    return key;
  }
  return t(entry).replace(/\{(\w+)\}/g, (marker, name) => String(values[name] ?? marker));
}

/** Período "julho de 2025 – Presente" no idioma atual; sem fim, exibe "Presente". */
export function formatPeriod(start, end) {
  return period(start, end, LONG_MONTH);
}

/** Período "07/2025 – Presente": formato compacto para o currículo. */
export function formatNumericPeriod(start, end) {
  return period(start, end, NUMERIC_MONTH);
}

/** Aplica o idioma atual ao <html lang> e aos elementos com data-i18n / data-i18n-aria-label. */
export function translateDocument() {
  document.documentElement.lang = LOCALES[language];

  for (const element of document.querySelectorAll("[data-i18n]")) {
    element.textContent = label(element.dataset.i18n);
  }
  for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
    element.setAttribute("aria-label", label(element.dataset.i18nAriaLabel));
  }
}

function period(start, end, format) {
  const finish = end ? formatDate(end, format) : label("experience.present");
  return `${formatDate(start, format)} – ${finish}`;
}

function formatDate(value, format) {
  const match = DATE_PATTERN.exec(value);
  if (!match) {
    console.error(`Data inválida (use "AAAA-MM" ou "AAAA"): ${value}`);
    return String(value);
  }

  const [, year, month] = match;
  if (!month) return year;

  return new Intl.DateTimeFormat(LOCALES[language], format).format(new Date(Number(year), Number(month) - 1));
}

function initialLanguage() {
  const saved = readPreference(STORAGE_KEY);
  if (isSupportedLanguage(saved)) return saved;

  const preferred = navigator.languages?.[0] ?? navigator.language ?? "";
  return preferred.toLowerCase().startsWith("pt") ? "pt" : "en";
}
