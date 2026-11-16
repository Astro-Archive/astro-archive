import { getAssetPath } from './assets';

/**
 * Sonidos de interfaz de Astro Archive.
 *
 * Se enganchan una sola vez al documento mediante delegación de eventos, así
 * que cualquier elemento interactivo (incluidos los del Sci-fi UI Kit y los
 * que se monten después) suena sin necesidad de cablear handlers a mano.
 *
 * Quedan fuera del selector las zonas de arrastre (canvas del simulador), que
 * reproducen el click desde su propio handler de selección.
 */

const STORAGE_KEY = 'astro-archive:ui-sound';

const SOUNDS = {
  hover: { src: '/audio/hover.mp3', volume: 0.25, pool: 3, minGap: 45 },
  click: { src: '/audio/click.mp3', volume: 0.35, pool: 3, minGap: 30 },
};

const INTERACTIVE_SELECTOR = [
  'a[href]',
  'button',
  'summary',
  'select',
  'label[for]',
  '[role="button"]',
  '[role="tab"]',
  '[role="menuitem"]',
  '[role="option"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'input[type="range"]',
  '[data-ui-sound]',
].join(',');

const pools = new Map();
const lastPlayedAt = { hover: 0, click: 0 };
let enabled = readPreference();
let initialized = false;
let lastHoverElement = null;

function readPreference() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === 'on';
  } catch {
    return true;
  }
}

function persistPreference(value) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
  } catch {
    /* almacenamiento no disponible: la preferencia vive solo en memoria */
  }
}

function getPool(name) {
  if (pools.has(name)) return pools.get(name);

  const config = SOUNDS[name];
  const source = getAssetPath(config.src);
  const pool = Array.from({ length: config.pool }, () => {
    const audio = new Audio(source);
    audio.preload = 'auto';
    audio.volume = config.volume;
    return audio;
  });

  pools.set(name, { pool, cursor: 0 });
  return pools.get(name);
}

function playSound(name) {
  if (!enabled || typeof Audio === 'undefined') return;

  const { minGap } = SOUNDS[name];
  const now = Date.now();
  if (now - lastPlayedAt[name] < minGap) return;
  lastPlayedAt[name] = now;

  const { pool, cursor } = getPool(name);
  const audio = pool[cursor % pool.length];
  getPool(name).cursor = cursor + 1;

  try {
    // Evitar reiniciar currentTime mientras el recurso aún no ha cargado datos (previene net::ERR_ABORTED)
    if (audio.readyState >= 2) {
      audio.currentTime = 0;
    }
    const result = audio.play();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  } catch {
    /* el navegador todavía no permite audio (falta gesto de usuario) */
  }
}

function toInteractive(node) {
  if (!(node instanceof Element)) return null;
  const element = node.closest(INTERACTIVE_SELECTOR);
  if (!element) return null;
  if (element.closest('[data-ui-sound="off"]')) return null;
  if (element.disabled === true || element.getAttribute('aria-disabled') === 'true') return null;
  return element;
}

function handlePointerOver(event) {
  if (event.pointerType === 'touch') return;

  const element = toInteractive(event.target);
  if (!element || element === lastHoverElement) return;

  lastHoverElement = element;
  playSound('hover');
}

function handlePointerOut(event) {
  const element = toInteractive(event.target);
  if (!element || element !== lastHoverElement) return;
  const next = event.relatedTarget;
  if (next instanceof Node && element.contains(next)) return;

  lastHoverElement = null;
}

function handlePointerDown(event) {
  if (toInteractive(event.target)) playSound('click');
}

function handleKeyDown(event) {
  if (event.repeat) return;
  if (event.key !== 'Enter' && event.key !== ' ' && event.key !== 'Spacebar') return;
  if (toInteractive(event.target)) playSound('click');
}

/** Reproduce el click desde código (p. ej. selección de un objeto en el 3D). */
export function playClickSound() {
  playSound('click');
}

/** Reproduce el hover desde código. */
export function playHoverSound() {
  playSound('hover');
}

export function setUISoundEnabled(next) {
  enabled = Boolean(next);
  persistPreference(enabled);
  if (!enabled) lastHoverElement = null;
}

export function isUISoundEnabled() {
  return enabled;
}

/** Engancha los listeners delegados. Idempotente. */
export function initUISound() {
  if (initialized || typeof document === 'undefined') return;
  initialized = true;

  document.addEventListener('pointerover', handlePointerOver, true);
  document.addEventListener('pointerout', handlePointerOut, true);
  document.addEventListener('pointerdown', handlePointerDown, true);
  document.addEventListener('keydown', handleKeyDown, true);
}
