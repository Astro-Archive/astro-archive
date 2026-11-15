/**
 * Resolves static asset paths (textures, models, audio) correctly
 * across local development, GitHub Pages subpaths (/astro-archive/), and custom domains.
 */
export function getAssetPath(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}
