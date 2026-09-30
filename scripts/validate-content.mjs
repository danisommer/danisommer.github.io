import { access, readFile } from "node:fs/promises";
import Ajv from "ajv";

const FILES = ["profile", "experience", "skills", "projects", "ui"];
const REFERENCE_CHECKS = {
  profile: checkProfile,
  skills: checkSkills,
  projects: checkProjects,
};

class UnreadableFileError extends Error {}

const problems = [];
const notes = [];

try {
  await validateContent();
} catch (error) {
  if (!(error instanceof UnreadableFileError)) throw error;
  console.error(`✗ ${error.message}`);
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`Conteúdo inválido (${problems.length} problema(s)):`);
  problems.forEach((problem) => console.error(`  ✗ ${problem}`));
  notes.forEach((note) => console.error(`  • ${note}`));
  process.exit(1);
}

console.log(`Conteúdo válido: ${FILES.map((name) => `data/${name}.json`).join(", ")}`);

async function validateContent() {
  const ajv = new Ajv({ allErrors: true, strict: false });
  ajv.addSchema(await readJson("data/schemas/common.schema.json"), "common.schema.json");

  for (const name of FILES) {
    const path = `data/${name}.json`;
    const [data, schema] = await Promise.all([readJson(path), readJson(`data/schemas/${name}.schema.json`)]);
    const validate = ajv.compile(schema);
    const check = REFERENCE_CHECKS[name];

    if (validate(data)) {
      await check?.(data);
      continue;
    }

    validate.errors.forEach((error) => problems.push(`${path} ${error.instancePath || "/"}: ${error.message}`));
    if (check) notes.push(`${path}: as checagens de referência (ids, categorias, níveis, imagens) rodam depois que os erros acima forem corrigidos.`);
  }
}

async function checkProfile(profile) {
  await checkFile("data/profile.json /photo/src", profile.photo.src);
}

function checkSkills({ levels, categories }) {
  categories.forEach((category, categoryIndex) => {
    category.items.forEach((skill, skillIndex) => {
      if (skill.level !== undefined && !Object.hasOwn(levels, skill.level)) {
        problems.push(
          `data/skills.json /categories/${categoryIndex}/items/${skillIndex}: nível "${skill.level}" não existe em "levels"`
        );
      }
    });
  });
}

async function checkProjects({ categories, items }) {
  const knownCategories = new Set(categories.map((category) => category.id));
  const seenIds = new Set();
  const seenCvPositions = new Set();

  for (const [index, project] of items.entries()) {
    const where = `data/projects.json /items/${index} (${project.id})`;

    if (seenIds.has(project.id)) problems.push(`${where}: id repetido`);
    seenIds.add(project.id);

    if (project.cv !== undefined && seenCvPositions.has(project.cv)) {
      problems.push(`${where}: posição "cv": ${project.cv} repetida`);
    }
    seenCvPositions.add(project.cv);

    project.categories
      .filter((id) => !knownCategories.has(id))
      .forEach((id) => problems.push(`${where}: categoria "${id}" não existe em "categories"`));

    if (project.image) await checkFile(where, project.image);
  }
}

async function checkFile(where, path) {
  try {
    await access(path);
  } catch {
    problems.push(`${where}: arquivo "${path}" não encontrado`);
  }
}

async function readJson(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new UnreadableFileError(`${path}: ${error.message}`, { cause: error });
  }
}
