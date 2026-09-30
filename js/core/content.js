const SOURCES = {
  profile: "data/profile.json",
  experience: "data/experience.json",
  skills: "data/skills.json",
  projects: "data/projects.json",
  ui: "data/ui.json",
};

export class ContentLoadError extends Error {
  constructor(path, cause) {
    super(`Falha ao carregar ${path}: ${cause.message}`, { cause });
    this.name = "ContentLoadError";
    this.path = path;
  }
}

/** Carrega todos os arquivos de data/; rejeita com ContentLoadError indicando o arquivo que falhou. */
export async function loadContent() {
  const entries = await Promise.all(
    Object.entries(SOURCES).map(async ([key, path]) => [key, await loadJson(path)])
  );
  return Object.fromEntries(entries);
}

async function loadJson(path) {
  try {
    const response = await fetch(path, { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (cause) {
    throw new ContentLoadError(path, cause);
  }
}
