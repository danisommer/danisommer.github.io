const SPACING = 22;
const FRAME_MS = 1000 / 60;
const OVERSCAN = 0.5;
const LOOK = {
  hero: { size: [1.4, 2.6], alpha: [0.22, 0.95] },
  page: { size: [1.4, 2.4], alpha: [0.2, 0.85] },
};
const CURSOR = {
  radius: 100,
  gain: 0.75,
  follow: 0.2,
  followPerPx: 0.004,
  followMax: 0.7,
  fadeIn: 0.25,
  fadeOut: 0.06,
  pulse: { rate: 1.5, depth: 0.5, reach: 0.75 },
};
const DROP = {
  radius: [40, 85],
  life: [3600, 6400],
  gain: 1.5,
  shape: 0.7,
  gap: [100, 280],
  areaPerDrop: 220000,
  count: [3, 8],
  candidates: 8,
  pulse: { rate: 2, depth: 0.7, reach: 0.8 },
};
const PULSE = { apex: 0.85, beats: 2, edge: 2, life: [4200, 5800] };

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/**
 * Fundo do site: grade de pontos presa à página que acende sob o cursor e em "toques" que surgem e somem devagar
 * (e onde o visitante toca); os efeitos se somam. A tela mantém sempre alguns toques visíveis, em fases
 * desencontradas e espalhados. No auge de cada toque, e em volta do cursor aceso, pontos acesos soltos pulsam para
 * menos: perdem parte do brilho e voltam devagar, duas vezes, a segunda mais de leve, sem nunca ficar mais claros
 * do que estavam. Quanto mais perto da borda, mais o ponto pulsa; perto do centro, a pulsação é rara e fraca.
 * O canvas fica atrás do conteúdo e rola com a página: cobre a janela com uma folga acima e abaixo (`OVERSCAN`, em
 * janelas) e, a cada desenho, é reposicionado na rolagem atual; também pinta o fundo do topo. Pausa com a aba oculta;
 * com movimento reduzido, a grade fica parada. Sem suporte a canvas, o site segue com os fundos do CSS.
 */
export function initDotField() {
  const canvas = document.querySelector(".dot-field canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    console.warn("Canvas 2D indisponível: o fundo de pontos foi desativado.");
    return;
  }

  const field = {
    hero: document.getElementById("home"),
    header: document.querySelector(".site-header"),
    ratio: 1,
    width: 0,
    height: 0,
    overscan: 0,
    canvasHeight: 0,
    top: 0,
    columns: 0,
    offsetX: 0,
    colors: { hero: "", heroBg: "", page: "" },
    drops: [],
    pulses: new Map(),
    cursor: { x: 0, y: 0, targetX: 0, targetY: 0, strength: 0, targetStrength: 0 },
    lastDrop: -Infinity,
    lastFrame: null,
    frame: null,
  };

  const running = () => !document.hidden && !reducedMotion.matches;

  const loop = (now) => {
    field.frame = null;
    if (!running()) return;
    step(field, now);
    draw(context, field);
    field.frame = requestAnimationFrame(loop);
  };

  const sync = () => {
    if (running()) {
      field.frame ??= requestAnimationFrame(loop);
      return;
    }
    if (field.frame !== null) cancelAnimationFrame(field.frame);
    field.frame = null;
    field.drops = [];
    field.pulses.clear();
    field.cursor.strength = 0;
    draw(context, field);
  };

  const readColors = () => {
    const heroStyle = getComputedStyle(field.hero);
    field.colors.hero = heroStyle.getPropertyValue("--color-text").trim();
    field.colors.heroBg = heroStyle.getPropertyValue("--color-bg").trim();
    field.colors.page = getComputedStyle(document.documentElement).getPropertyValue("--color-text").trim();
  };

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;

    field.ratio = ratio;
    field.width = window.innerWidth;
    field.height = window.innerHeight;
    field.overscan = Math.round(field.height * OVERSCAN);
    field.canvasHeight = field.height + 2 * field.overscan;
    field.top = field.header.getBoundingClientRect().height;
    field.columns = Math.floor(field.width / SPACING);
    field.offsetX = (field.width - (field.columns - 1) * SPACING) / 2;
    field.pulses.clear();
    canvas.width = Math.round(field.width * ratio);
    canvas.height = Math.round(field.canvasHeight * ratio);
    canvas.style.height = `${field.canvasHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(context, field);
  };

  const drawIfStill = () => {
    if (!running()) draw(context, field);
  };

  window.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;
    const { cursor } = field;

    if (cursor.strength < 0.01) {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
    }
    cursor.targetX = event.clientX;
    cursor.targetY = event.clientY;
    cursor.targetStrength = 1;
  });

  document.documentElement.addEventListener("pointerleave", () => {
    field.cursor.targetStrength = 0;
  });

  window.addEventListener("pointerdown", (event) => {
    if (!running()) return;
    field.drops.push(createDrop(event.clientX, event.clientY + window.scrollY, performance.now()));
  });

  new MutationObserver(() => {
    readColors();
    drawIfStill();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  window.addEventListener("resize", resize);
  window.addEventListener("scroll", drawIfStill, { passive: true });
  document.addEventListener("visibilitychange", sync);
  reducedMotion.addEventListener("change", sync);

  document.documentElement.classList.add("has-dot-field");
  readColors();
  resize();
  sync();
}

function step(field, now) {
  const { cursor } = field;
  const scroll = window.scrollY;
  const frames = field.lastFrame === null ? 1 : Math.min(4, (now - field.lastFrame) / FRAME_MS);
  const dx = cursor.targetX - cursor.x;
  const dy = cursor.targetY - cursor.y;
  const follow = Math.min(CURSOR.followMax, CURSOR.follow + Math.hypot(dx, dy) * CURSOR.followPerPx);
  const fade = cursor.targetStrength > cursor.strength ? CURSOR.fadeIn : CURSOR.fadeOut;

  field.lastFrame = now;
  cursor.x += dx * perFrames(follow, frames);
  cursor.y += dy * perFrames(follow, frames);
  cursor.strength += (cursor.targetStrength - cursor.strength) * perFrames(fade, frames);

  field.drops = field.drops.filter((drop) => now - drop.born < drop.life && onScreen(drop, scroll, field.height));
  const target = targetDrops(field);
  if (field.drops.length < target && now - field.lastDrop >= spawnGap(field.drops.length, target)) {
    const point = spawnPoint(field, scroll);
    field.drops.push(createDrop(point.x, point.y + scroll, now));
    field.lastDrop = now;
  }
  for (const drop of field.drops) {
    drop.strength = DROP.gain * Math.sin(Math.PI * ((now - drop.born) / drop.life)) ** DROP.shape;
    if (drop.strength >= DROP.gain * PULSE.apex && happens(DROP.pulse.rate, frames)) {
      addPulse(field, drop.x, drop.pageY, drop.radius, DROP.pulse, now);
    }
  }
  if (cursor.strength >= PULSE.apex && happens(CURSOR.pulse.rate, frames)) {
    addPulse(field, cursor.x, cursor.y + scroll, CURSOR.radius, CURSOR.pulse, now);
  }
  updatePulses(field.pulses, now);
}

function perFrames(rate, frames) {
  return 1 - (1 - rate) ** frames;
}

function happens(ratePerSecond, frames) {
  return Math.random() < 1 - Math.exp((-ratePerSecond * frames * FRAME_MS) / 1000);
}

function addPulse(field, centerX, centerPageY, radius, { depth, reach }, now) {
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.sqrt(Math.random()) * reach * radius;
  const column = Math.round((centerX + Math.cos(angle) * distance - field.offsetX) / SPACING);
  const row = Math.round((centerPageY + Math.sin(angle) * distance - SPACING / 2) / SPACING);
  const key = row * field.columns + column;

  if (column < 0 || column >= field.columns || row < 0 || field.pulses.has(key)) return;

  const dotX = field.offsetX + column * SPACING;
  const dotY = row * SPACING + SPACING / 2;
  const edge = Math.min(1, Math.hypot(dotX - centerX, dotY - centerPageY) / (reach * radius)) ** PULSE.edge;
  if (Math.random() > edge) return;
  field.pulses.set(key, { born: now, life: between(PULSE.life), depth: depth * edge, dim: 0 });
}

function updatePulses(pulses, now) {
  for (const [key, pulse] of pulses) {
    const progress = (now - pulse.born) / pulse.life;
    if (progress >= 1) {
      pulses.delete(key);
      continue;
    }
    pulse.dim = pulse.depth * (1 - progress) * Math.sin(Math.PI * PULSE.beats * progress) ** 2;
  }
}

function spawnGap(count, target) {
  const [min, max] = DROP.gap;
  return min + (max - min) * (count / target);
}

function targetDrops({ width, height }) {
  const [min, max] = DROP.count;
  return Math.min(max, Math.max(min, Math.round((width * height) / DROP.areaPerDrop)));
}

function onScreen(drop, scroll, height) {
  const y = drop.pageY - scroll;
  return y > -drop.radius && y < height + drop.radius;
}

function spawnPoint(field, scroll) {
  let best = null;
  let bestDistance = -1;

  for (let attempt = 0; attempt < DROP.candidates; attempt += 1) {
    const candidate = {
      x: Math.random() * field.width,
      y: field.top + Math.random() * (field.height - field.top),
    };
    const distance = Math.min(
      ...field.drops.map((drop) => Math.hypot(drop.x - candidate.x, drop.pageY - scroll - candidate.y))
    );
    if (distance > bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best;
}

function createDrop(x, pageY, now) {
  return { x, pageY, born: now, life: between(DROP.life), radius: between(DROP.radius), strength: 0 };
}

function draw(context, field) {
  const { ratio, width, overscan, canvasHeight, columns, offsetX, pulses } = field;
  const scroll = window.scrollY;
  const canvasTop = Math.round(Math.max(0, scroll - overscan) * ratio) / ratio;
  const shift = scroll - canvasTop;
  const heroBox = field.hero.getBoundingClientRect();

  context.canvas.style.transform = `translateY(${canvasTop}px)`;
  context.clearRect(0, 0, width, canvasHeight);
  if (heroBox.bottom + shift > 0 && heroBox.top + shift < canvasHeight) {
    context.fillStyle = field.colors.heroBg;
    context.fillRect(0, heroBox.top + shift, width, heroBox.height);
  }

  for (let row = Math.floor(canvasTop / SPACING); ; row += 1) {
    const y = row * SPACING + SPACING / 2 - scroll;
    if (y + shift > canvasHeight + SPACING) break;

    const region = y >= heroBox.top && y < heroBox.bottom ? "hero" : "page";
    const { size, alpha } = LOOK[region];
    context.fillStyle = field.colors[region];

    for (let column = 0; column < columns; column += 1) {
      const x = offsetX + column * SPACING;
      const dim = pulses.get(row * columns + column)?.dim ?? 0;
      const level = Math.min(1, intensity(field, x, y, scroll)) * (1 - dim);

      context.globalAlpha = alpha[0] + (alpha[1] - alpha[0]) * level;
      context.beginPath();
      context.arc(x, y + shift, (size[0] + (size[1] - size[0]) * level) / 2, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.globalAlpha = 1;
}

function intensity({ cursor, drops }, x, y, scroll) {
  let total = cursor.strength * CURSOR.gain * falloff(x, y, cursor.x, cursor.y, CURSOR.radius);
  for (const drop of drops) {
    total += drop.strength * falloff(x, y, drop.x, drop.pageY - scroll, drop.radius);
  }
  return total;
}

function falloff(x, y, centerX, centerY, radius) {
  const distance = Math.hypot(x - centerX, y - centerY) / radius;
  if (distance >= 1) return 0;
  const inner = 1 - distance * distance;
  return inner * inner;
}

function between([min, max]) {
  return min + Math.random() * (max - min);
}
