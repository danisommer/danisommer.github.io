import { loadContent } from "./core/content.js";
import { h } from "./core/dom.js";
import { setDictionary, setLanguage, translateDocument } from "./core/i18n.js";
import { initTheme } from "./core/theme.js";
import * as about from "./sections/about.js";
import * as contact from "./sections/contact.js";
import * as experience from "./sections/experience.js";
import * as footer from "./sections/footer.js";
import * as hero from "./sections/hero.js";
import * as navigation from "./sections/navigation.js";
import * as projects from "./sections/projects.js";
import * as skills from "./sections/skills.js";

const sections = [navigation, hero, about, skills, experience, projects, contact, footer];

initTheme();
start();

async function start() {
  let content;
  try {
    content = await loadContent();
  } catch (error) {
    showLoadError(error);
    return;
  }

  setDictionary(content.ui);

  const changeLanguage = (language) => {
    setLanguage(language);
    renderPage(content);
  };

  sections.forEach((section) => section.setup?.({ content, changeLanguage }));
  renderPage(content);
}

function renderPage(content) {
  translateDocument();
  sections.forEach((section) => section.render(content));
}

function showLoadError(error) {
  console.error(error);
  document.querySelector(".hero-btns").hidden = true;
  document.querySelector(".hero-content").prepend(
    h(
      "div",
      { class: "load-error", role: "alert" },
      h("p", {}, "Não foi possível carregar o conteúdo do portfólio. / The portfolio content could not be loaded."),
      h("p", { class: "load-error-detail" }, error.message)
    )
  );
}
