/**
 * Resuelve valores bilingües del contenido.
 *
 * Los datos de misiones, planetas y catálogos guardan cada texto como
 * `{ en, es }`. `localize` recorre el objeto completo (objetos y arrays) y
 * devuelve una copia con el idioma elegido, de forma que los componentes
 * siguen leyendo `artifact.summary` como siempre.
 */
export function isLocalizedValue(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    typeof value.en === 'string' &&
    typeof value.es === 'string' &&
    Object.keys(value).length === 2
  );
}

export function localize(value, lang = 'en') {
  if (Array.isArray(value)) return value.map((entry) => localize(entry, lang));
  if (isLocalizedValue(value)) return value[lang] ?? value.en;

  if (value !== null && typeof value === 'object') {
    const result = {};
    Object.entries(value).forEach(([key, entry]) => {
      result[key] = localize(entry, lang);
    });
    return result;
  }

  return value;
}

/** Helper corto para un único texto bilingüe. */
export function pick(value, lang = 'en') {
  return isLocalizedValue(value) ? value[lang] ?? value.en : value;
}
