import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { messages } from './messages';
import { localize } from './localize';

export const LANGUAGES = ['en', 'es'];
export const DEFAULT_LANGUAGE = 'en';

const STORAGE_KEY = 'astro-archive:lang';

const I18nContext = createContext(null);

function readStoredLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return LANGUAGES.includes(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function normalizeLanguage(value) {
  return LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
}

function interpolate(text, vars) {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, key) => (key in vars ? String(vars[key]) : match));
}

/**
 * Proveedor de idioma de Astro Archive.
 *
 * - Inglés por defecto; el español se activa con el conmutador del HUD.
 * - La elección se recuerda en localStorage y se refleja en <html lang>.
 * - `t()` acepta variables: t('hud.counter', { scanned: 3, total: 7 }).
 * - `localizeValue()` resuelve contenido bilingüe de los datos.
 */
export function I18nProvider({ children, initialLanguage }) {
  const [lang, setLang] = useState(() => normalizeLanguage(initialLanguage ?? readStoredLanguage()));

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* almacenamiento no disponible */
    }
  }, [lang]);

  const setLanguage = useCallback((next) => setLang(normalizeLanguage(next)), []);
  const toggleLanguage = useCallback(
    () => setLang((current) => (current === 'en' ? 'es' : 'en')),
    [],
  );

  const t = useCallback(
    (key, vars) => {
      const table = messages[lang] || messages[DEFAULT_LANGUAGE];
      const text = table[key] ?? messages[DEFAULT_LANGUAGE][key] ?? key;
      return interpolate(text, vars);
    },
    [lang],
  );

  const localizeValue = useCallback((value) => localize(value, lang), [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLanguage,
      toggleLanguage,
      t,
      localizeValue,
      isEnglish: lang === 'en',
    }),
    [lang, setLanguage, toggleLanguage, t, localizeValue],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n debe usarse dentro de <I18nProvider>');
  }
  return context;
}
