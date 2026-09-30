import { h } from "../core/dom.js";
import { label, t } from "../core/i18n.js";

const AUTOPLAY_DELAY = 5000;
const SWIPE_THRESHOLD = 50;
const STEPS = { prev: -1, next: 1 };
const KEY_STEPS = { ArrowLeft: -1, ArrowRight: 1 };
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const carousel = {
  root: null,
  index: 0,
  count: 0,
  timer: null,
  stopped: false,
  hovered: false,
  focused: false,
  visible: false,
};

export function setup() {
  const root = document.querySelector(".skills-carousel-container");
  carousel.root = root;

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.getAttribute("aria-disabled") === "true") return;

    const target = targetOf(button);
    if (target !== null) navigate(target);
  });

  root.addEventListener("keydown", (event) => {
    const step = KEY_STEPS[event.key];
    if (!step) return;
    event.preventDefault();
    navigate(carousel.index + step);
  });

  setupSwipe(root.querySelector(".skills-carousel"));
  setupAutoplayPauses(root);
}

export function render({ skills }) {
  const { root } = carousel;
  const { categories, levels } = skills;

  carousel.count = categories.length;
  carousel.index = Math.min(carousel.index, Math.max(carousel.count - 1, 0));

  root.querySelector(".skills-carousel").replaceChildren(
    ...categories.map((category) => renderCategory(category, levels))
  );
  root.querySelector(".carousel-indicators").replaceChildren(
    ...categories.map((category, index) =>
      h("button", {
        type: "button",
        class: "carousel-indicator",
        "data-slide": index,
        "aria-label": label("skills.goTo", { category: t(category.title) }),
      })
    )
  );
  root.classList.toggle("is-static", carousel.count < 2);

  update();
  syncAutoplay();
}

function renderCategory(category, levels) {
  return h(
    "div",
    { class: "skill-category" },
    h("h3", {}, t(category.title)),
    h(
      "div",
      { class: "skill-items" },
      category.items.map((skill) =>
        h(
          "div",
          { class: "skill-item" },
          h("span", { class: "skill-name" }, t(skill.name)),
          skill.level && h("span", { class: "skill-level" }, levelLabel(skill.level, levels))
        )
      )
    )
  );
}

function levelLabel(level, levels) {
  if (Object.hasOwn(levels, level)) return t(levels[level]);
  console.warn(`Nível "${level}" não existe em "levels" (data/skills.json).`);
  return level;
}

function targetOf(button) {
  const step = STEPS[button.dataset.carousel];
  if (step) return carousel.index + step;
  if (button.dataset.slide !== undefined) return Number(button.dataset.slide);
  return null;
}

function navigate(index) {
  carousel.stopped = true;
  syncAutoplay();
  goTo(index);
}

function goTo(index) {
  carousel.index = Math.min(Math.max(index, 0), carousel.count - 1);
  update();
}

function update() {
  const { root, index, count } = carousel;

  root.querySelector(".skills-carousel").style.transform = `translateX(-${index * 100}%)`;

  root.querySelectorAll(".skill-category").forEach((slide, position) => {
    slide.classList.toggle("is-active", position === index);
    slide.setAttribute("aria-hidden", String(position !== index));
  });
  root.querySelectorAll(".carousel-indicator").forEach((indicator, position) => {
    indicator.setAttribute("aria-current", String(position === index));
  });

  root.querySelector('[data-carousel="prev"]').setAttribute("aria-disabled", String(index === 0));
  root.querySelector('[data-carousel="next"]').setAttribute("aria-disabled", String(index >= count - 1));
}

function setupSwipe(track) {
  let start = null;

  track.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      start = { x: touch.clientX, y: touch.clientY };
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (event) => {
      if (!start) return;
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;
      start = null;

      if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY)) return;
      navigate(carousel.index + (deltaX < 0 ? 1 : -1));
    },
    { passive: true }
  );
}

function setupAutoplayPauses(root) {
  root.addEventListener("mouseenter", () => {
    carousel.hovered = true;
    syncAutoplay();
  });
  root.addEventListener("mouseleave", () => {
    carousel.hovered = false;
    syncAutoplay();
  });
  root.addEventListener("focusin", () => {
    carousel.focused = true;
    syncAutoplay();
  });
  root.addEventListener("focusout", (event) => {
    if (root.contains(event.relatedTarget)) return;
    carousel.focused = false;
    syncAutoplay();
  });

  new IntersectionObserver(
    ([entry]) => {
      carousel.visible = entry.isIntersecting;
      syncAutoplay();
    },
    { threshold: 0.5 }
  ).observe(root);

  reducedMotion.addEventListener("change", syncAutoplay);
}

function syncAutoplay() {
  const shouldRun =
    carousel.count > 1 &&
    carousel.visible &&
    !carousel.stopped &&
    !carousel.hovered &&
    !carousel.focused &&
    !reducedMotion.matches;

  if (shouldRun && carousel.timer === null) {
    carousel.timer = setInterval(() => goTo((carousel.index + 1) % carousel.count), AUTOPLAY_DELAY);
  }
  if (!shouldRun && carousel.timer !== null) {
    clearInterval(carousel.timer);
    carousel.timer = null;
  }
}
