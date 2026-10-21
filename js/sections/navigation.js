import { getLanguage } from "../core/i18n.js";

const desktopLayout = window.matchMedia("(min-width: 993px)");

export function setup({ changeLanguage }) {
  setupLanguageToggles(changeLanguage);
  setupMobileMenu();
  setupActiveLink();
}

export function render({ profile }) {
  document.querySelector(".brand").textContent = profile.name;

  for (const button of document.querySelectorAll("[data-lang]")) {
    button.setAttribute("aria-pressed", String(button.dataset.lang === getLanguage()));
  }
}

function setupLanguageToggles(changeLanguage) {
  for (const button of document.querySelectorAll("[data-lang]")) {
    button.addEventListener("click", () => {
      if (button.dataset.lang !== getLanguage()) changeLanguage(button.dataset.lang);
    });
  }
}

function setupMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.getElementById("mobile-nav");
  const closeButton = drawer.querySelector(".mobile-nav-close");
  const overlay = document.querySelector(".overlay");
  const background = document.querySelectorAll(".site-header, main, .site-footer");

  const setOpen = (open) => {
    drawer.classList.toggle("is-open", open);
    overlay.classList.toggle("is-visible", open);
    document.body.classList.toggle("is-locked", open);
    toggle.setAttribute("aria-expanded", String(open));
    drawer.inert = !open;
    background.forEach((element) => {
      element.inert = open;
    });
  };

  const open = () => {
    setOpen(true);
    closeButton.focus();
  };

  const close = () => {
    setOpen(false);
    toggle.focus();
  };

  toggle.addEventListener("click", open);
  closeButton.addEventListener("click", close);
  overlay.addEventListener("click", close);

  drawer.querySelector(".mobile-links").addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && drawer.classList.contains("is-open")) close();
  });

  desktopLayout.addEventListener("change", (event) => {
    if (event.matches && drawer.classList.contains("is-open")) setOpen(false);
  });
}

function setupActiveLink() {
  const links = document.querySelectorAll(".nav-links a, .mobile-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => markCurrent(links, `#${entry.target.id}`));
    },
    { rootMargin: "-50% 0px -50% 0px" }
  );

  document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
}

function markCurrent(links, hash) {
  for (const link of links) {
    if (link.getAttribute("href") === hash) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}
