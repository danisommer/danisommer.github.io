import { readPreference, savePreference } from "./storage.js";

const STORAGE_KEY = "theme";
const THEMES = ["light", "dark"];
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * Liga os botões [data-theme-toggle]. O tema inicial já foi aplicado pelo script do <head>;
 * enquanto o visitante não escolher um tema, a página acompanha o tema do sistema.
 */
export function initTheme() {
  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.addEventListener("click", toggleTheme);
  }

  systemPrefersDark.addEventListener("change", (event) => {
    if (THEMES.includes(readPreference(STORAGE_KEY))) return;
    applyTheme(event.matches ? "dark" : "light");
  });

  syncToggles();
}

function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  savePreference(STORAGE_KEY, next);
  applyTheme(next);
}

function currentTheme() {
  return document.documentElement.dataset.theme;
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  syncToggles();
}

function syncToggles() {
  const isDark = currentTheme() === "dark";

  for (const button of document.querySelectorAll("[data-theme-toggle]")) {
    button.setAttribute("aria-pressed", String(isDark));
    button.querySelector("i").className = isDark ? "fas fa-sun" : "fas fa-moon";
  }
}
