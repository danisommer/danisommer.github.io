const state = {
  currentLang: localStorage.getItem("language") || "pt",
  translations: null,
  projects: null,
  lastFocusedElement: null,
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

function loadJson(path) {
  return fetch(path, { cache: "no-store" }).then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return response.json();
  });
}

function applyTranslations() {
  const translations = state.translations?.[state.currentLang];
  if (!translations) return;

  document.documentElement.lang =
    state.currentLang === "pt" ? "pt-br" : "en";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const value = translations[key];
    if (!value) return;

    const attr = element.getAttribute("data-i18n-attr");
    if (attr) {
      element.setAttribute(attr, value);
      return;
    }

    if (element.tagName === "META") {
      element.setAttribute("content", value);
      return;
    }

    element.textContent = value;
  });
}

function updateSkillLevels() {
  const translations = state.translations?.[state.currentLang];
  if (!translations) return;

  const levelKeyMap = {
    basic: "skill-level-basic",
    intermediate: "skill-level-intermediate",
    advanced: "skill-level-advanced",
    fluent: "skill-level-fluent",
  };

  const normalize = (text) => {
    switch (text.trim()) {
      case "Básico":
      case "Basic":
        return "basic";
      case "Intermediário":
      case "Intermediate":
        return "intermediate";
      case "Avançado":
      case "Advanced":
        return "advanced";
      case "Fluente":
      case "Fluent":
        return "fluent";
      default:
        return null;
    }
  };

  document.querySelectorAll(".skill-level").forEach((level) => {
    const levelKey =
      level.dataset.skillLevel || normalize(level.textContent);
    if (!levelKey) return;

    level.dataset.skillLevel = levelKey;
    const translationKey = levelKeyMap[levelKey];
    if (translationKey && translations[translationKey]) {
      level.textContent = translations[translationKey];
    }
  });
}

function updateLanguageUI() {
  document
    .querySelectorAll(".language-btn span, .language-btn-mobile span")
    .forEach((span) => {
      span.textContent = state.currentLang.toUpperCase();
    });

  document.querySelectorAll(".language-option").forEach((option) => {
    const isActive = option.dataset.lang === state.currentLang;
    option.classList.toggle("active", isActive);
    option.setAttribute("aria-selected", String(isActive));
  });
}

function updateProjectCards() {
  if (!state.projects) return;

  document.querySelectorAll(".project-card").forEach((card) => {
    const projectId = card.dataset.projectId;
    const project = state.projects[projectId];
    if (!project) return;

    const titleEl = card.querySelector(".project-title-text");
    if (titleEl) {
      titleEl.textContent =
        project.title[state.currentLang] || project.title.pt;
    }

    const descEl = card.querySelector(".project-desc");
    if (descEl) {
      descEl.textContent =
        project.summary[state.currentLang] || project.summary.pt;
    }
  });
}

function buildProjectDetailsHtml(project, lang) {
  const intro = project.details?.intro?.[lang] || project.details?.intro?.pt;
  const features =
    project.details?.features?.[lang] || project.details?.features?.pt || [];
  const outro = project.details?.outro?.[lang] || project.details?.outro?.pt;
  const resourcesLabel =
    state.translations?.[lang]?.["modal-resources"] || "Recursos incluem:";

  let html = "";
  if (intro) {
    html += `<p>${intro}</p>`;
  }

  if (features.length) {
    html += `<p>${resourcesLabel}</p>`;
    html += `<ul>${features.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  }

  if (outro) {
    html += `<p>${outro}</p>`;
  }

  return html;
}

function buildProjectLinkHtml(link, lang) {
  const labelKey = link.type === "demo" ? "project-live-demo" : "project-github";
  const label = state.translations?.[lang]?.[labelKey] || link.type;
  const iconClass = link.type === "demo" ? "fas fa-globe" : "fab fa-github";

  return `
    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="btn">
      <i class="${iconClass}" aria-hidden="true"></i>
      <span>${label}</span>
    </a>
  `;
}

function renderProjectModal(projectId, options = {}) {
  const projectModal = document.getElementById("projectModal");
  const projectDetails = projectModal?.querySelector(".project-details");
  const project = state.projects?.[projectId];

  if (!projectModal || !projectDetails || !project) return;

  const lang = state.currentLang;
  const title = project.title[lang] || project.title.pt;
  const imageAlt = project.image?.alt?.[lang] || project.image?.alt?.pt || title;
  const imageHtml = project.image
    ? `<img src="${project.image.src}" alt="${imageAlt}" loading="lazy" width="${project.image.width}" height="${project.image.height}">`
    : "";

  const tagsHtml = (project.tags || [])
    .map((tag) => `<span class="project-tag">${tag}</span>`)
    .join("");

  const detailsHtml = buildProjectDetailsHtml(project, lang);
  const linksHtml = (project.links || [])
    .map((link) => buildProjectLinkHtml(link, lang))
    .join("");

  projectDetails.dataset.projectId = projectId;
  projectDetails.innerHTML = `
    <h2 id="projectModalTitle">${title}</h2>
    <div class="project-details-img">${imageHtml}</div>
    <div class="project-details-tags">${tagsHtml}</div>
    <div class="project-details-desc">${detailsHtml}</div>
    <div class="project-details-links">${linksHtml}</div>
  `;

  projectModal.setAttribute("aria-labelledby", "projectModalTitle");

  if (!options.preserveFocus) {
    const closeButton = projectModal.querySelector(".close-modal");
    if (closeButton) {
      closeButton.focus();
    }
  }
}

function openProjectModal(projectId) {
  const projectModal = document.getElementById("projectModal");
  if (!projectModal || !state.projects?.[projectId]) return;

  state.lastFocusedElement = document.activeElement;
  renderProjectModal(projectId);

  projectModal.classList.add("active");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  const projectModal = document.getElementById("projectModal");
  if (!projectModal) return;

  projectModal.classList.remove("active");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (state.lastFocusedElement && state.lastFocusedElement.focus) {
    state.lastFocusedElement.focus();
  }
}

function updateOpenModal() {
  const projectModal = document.getElementById("projectModal");
  const projectDetails = projectModal?.querySelector(".project-details");
  if (!projectModal || !projectDetails) return;

  if (!projectModal.classList.contains("active")) return;

  const projectId = projectDetails.dataset.projectId;
  if (projectId) {
    renderProjectModal(projectId, { preserveFocus: true });
  }
}

function updateLanguage(lang) {
  if (!lang) return;

  state.currentLang = lang;
  localStorage.setItem("language", state.currentLang);

  applyTranslations();
  updateSkillLevels();
  updateLanguageUI();
  updateProjectCards();
  updateOpenModal();
}

function initThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  const themeToggleMobile = document.querySelector(".theme-toggle-mobile");

  const updateIcons = (isDark) => {
    [themeToggle, themeToggleMobile].forEach((button) => {
      if (!button) return;
      const icon = button.querySelector("i");
      if (!icon) return;
      icon.classList.toggle("fa-moon", !isDark);
      icon.classList.toggle("fa-sun", isDark);
      button.setAttribute("aria-pressed", String(isDark));
    });
  };

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-mode", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcons(isDark);
  };

  const toggleTheme = () => {
    const isDark = document.body.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark");
  };

  themeToggle?.addEventListener("click", toggleTheme);
  themeToggleMobile?.addEventListener("click", toggleTheme);

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    updateIcons(document.body.classList.contains("dark-mode"));
  }
}

function initMobileNav() {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const closeNav = document.querySelector(".close-nav");
  const overlay = document.querySelector(".overlay");

  if (!mobileToggle || !mobileNav || !closeNav || !overlay) {
    return { close: () => {} };
  }

  const openNavigation = () => {
    mobileNav.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("nav-open");
    mobileToggle.setAttribute("aria-expanded", "true");
    mobileNav.setAttribute("aria-hidden", "false");
  };

  const closeNavigation = () => {
    mobileNav.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("nav-open");
    mobileToggle.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
  };

  mobileToggle.addEventListener("click", openNavigation);
  closeNav.addEventListener("click", closeNavigation);
  overlay.addEventListener("click", closeNavigation);

  return { close: closeNavigation };
}

function initHeaderScroll() {
  const header = document.querySelector("header");
  const backToTop = document.querySelector(".back-to-top");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-links a");

  const updateActiveNav = () => {
    const scrollPosition = window.scrollY;

    document.querySelectorAll("section").forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  const onScroll = () => {
    if (header) {
      header.classList.toggle("header--scrolled", window.scrollY > 100);
    }
    if (backToTop) {
      backToTop.classList.toggle("active", window.scrollY > 100);
    }
    updateActiveNav();
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  }
}

function initSmoothScrolling(navState) {
  const links = document.querySelectorAll(
    ".nav-links a, .mobile-links a, .footer-links a, .hero-btns a, .logo"
  );

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      navState?.close();

      const targetPosition = target.offsetTop - 80;
      window.scrollTo({
        top: targetPosition,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    });
  });
}

function initProjectFiltering() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;

      projectCards.forEach((card) => {
        if (filter === "all") {
          card.style.display = "block";
          return;
        }

        const categories = card.dataset.category.split(" ");
        card.style.display = categories.includes(filter) ? "block" : "none";
      });
    });
  });
}

function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const closeButton = modal?.querySelector(".close-modal");

  document.querySelectorAll(".project-details-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const projectId = button.dataset.projectId;
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  closeButton?.addEventListener("click", closeProjectModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeProjectModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("active")) {
      closeProjectModal();
    }
  });
}

function initLanguageDropdowns(navState) {
  const selectors = [
    {
      wrapper: document.querySelector(".language-selector"),
      button: document.querySelector(".language-btn"),
    },
    {
      wrapper: document.querySelector(".language-selector-mobile"),
      button: document.querySelector(".language-btn-mobile"),
    },
  ];

  const setOpen = (wrapper, button, isOpen) => {
    if (!wrapper || !button) return;
    wrapper.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  };

  const closeAll = () => {
    selectors.forEach(({ wrapper, button }) => setOpen(wrapper, button, false));
  };

  selectors.forEach(({ wrapper, button }) => {
    if (!wrapper || !button) return;

    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = wrapper.classList.contains("is-open");
      closeAll();
      setOpen(wrapper, button, !isOpen);
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInside = selectors.some(
      ({ wrapper }) => wrapper && wrapper.contains(event.target)
    );
    if (!clickedInside) {
      closeAll();
    }
  });

  document.querySelectorAll(".language-option").forEach((option) => {
    option.addEventListener("click", () => {
      const lang = option.dataset.lang || "pt";
      updateLanguage(lang);
      closeAll();
      navState?.close();
    });
  });

  updateLanguageUI();
}

function initSkillsCarousel() {
  const carousel = document.querySelector(".skills-carousel");
  const skillCategories = document.querySelectorAll(".skill-category");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  if (!carousel || skillCategories.length === 0) return;

  indicatorsContainer.innerHTML = "";
  let currentIndex = 0;

  skillCategories.forEach((_, index) => {
    const indicator = document.createElement("div");
    indicator.classList.add("carousel-indicator");
    if (index === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(index));
    indicatorsContainer.appendChild(indicator);
  });

  const updateCarouselState = () => {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    skillCategories.forEach((category, index) => {
      category.classList.toggle("active", index === currentIndex);
    });

    const indicators = document.querySelectorAll(".carousel-indicator");
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });

    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === skillCategories.length - 1;
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarouselState();
    }
  };

  const nextSlide = () => {
    if (currentIndex < skillCategories.length - 1) {
      currentIndex += 1;
      updateCarouselState();
    }
  };

  const goToSlide = (index) => {
    currentIndex = index;
    updateCarouselState();
  };

  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);

  let touchStartX = 0;
  let touchEndX = 0;

  carousel.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  });

  carousel.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  });

  updateCarouselState();

  let autoRotate = setInterval(() => {
    if (currentIndex < skillCategories.length - 1) {
      nextSlide();
    } else {
      currentIndex = 0;
      updateCarouselState();
    }
  }, 5000);

  const stopAutoRotate = () => clearInterval(autoRotate);
  carousel.addEventListener("mouseenter", stopAutoRotate);
  prevBtn?.addEventListener("mouseenter", stopAutoRotate);
  nextBtn?.addEventListener("mouseenter", stopAutoRotate);
  indicatorsContainer.addEventListener("mouseenter", stopAutoRotate);
}

function initContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", () => {
    sessionStorage.setItem("formSubmitted", "true");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const navState = initMobileNav();

  initThemeToggle();
  initHeaderScroll();
  initSmoothScrolling(navState);
  initProjectFiltering();
  initProjectModal();
  initSkillsCarousel();
  initContactForm();

  Promise.all([
    loadJson("data/translations.json"),
    loadJson("data/projects.json"),
  ])
    .then(([translations, projects]) => {
      state.translations = translations;
      state.projects = projects;
      updateLanguage(state.currentLang);
      initLanguageDropdowns(navState);
    })
    .catch((error) => {
      console.error("Failed to load site data:", error);
      initLanguageDropdowns(navState);
    });

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }
});
