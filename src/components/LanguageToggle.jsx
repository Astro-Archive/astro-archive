import React from 'react';
import { Languages } from 'lucide-react';
import SciFiButton from './ui/SciFiButton';
import { useI18n } from '../i18n';

/**
 * Conmutador EN/ES del HUD. Inglés es el idioma por defecto; la elección
 * persiste en localStorage a través de I18nProvider.
 */
export default function LanguageToggle({ className = '' }) {
  const { lang, toggleLanguage, t } = useI18n();
  const isEnglish = lang === 'en';

  return (
    <SciFiButton
      variant="secondary"
      onClick={toggleLanguage}
      showArrow={false}
      icon={<Languages className="w-4 h-4" />}
      title={t('hud.languageSwitch')}
      aria-label={t('hud.languageSwitch')}
      className={className}
    >
      <span>{isEnglish ? 'EN' : 'ES'}</span>
    </SciFiButton>
  );
}
