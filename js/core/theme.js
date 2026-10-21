import { savePreference } from "./storage.js";

const STORAGE_KEY = "theme";

/**
 * Liga os botões [data-theme-toggle]. O tema inicial já foi aplicado pelo script do <head>:
 * o escuro é o padrão do site; o claro vale quando o visitante o escolhe (e fica salvo).
 */
export function initTheme() {
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.addEventListener("click", toggleTheme);
  }

  syncToggles();
}

function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  savePreference(STORAGE_KEY, next);
  document.documentElement.dataset.theme = next;
  syncToggles();
}

function currentTheme() {
  return document.documentElement.dataset.theme;
}

function syncToggles() {
  const isDark = currentTheme() === "dark";

  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.setAttribute("aria-pressed", String(isDark));
  }
}
