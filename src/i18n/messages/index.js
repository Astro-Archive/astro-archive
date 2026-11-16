import common from './common';
import hud from './hud';
import badges from './badges';
import curiosity from './curiosity';
import observatory from './observatory';
import surface from './surface';

/**
 * Diccionarios planos por idioma. Cada namespace (fichero) aporta sus claves
 * y aquí se combinan para que `t('hud.something')` funcione en toda la app.
 */
const namespaces = [common, hud, badges, curiosity, observatory, surface];

export const messages = namespaces.reduce(
  (acc, namespace) => ({
    en: { ...acc.en, ...namespace.en },
    es: { ...acc.es, ...namespace.es },
  }),
  { en: {}, es: {} },
);
