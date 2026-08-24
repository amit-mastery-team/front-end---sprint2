import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import en from './en.json';
import ar from './ar.json';
import { DEFAULT_LANGUAGE, LANGUAGE, directionOf } from './languages';
import { persistLanguage, readPreferredLanguage } from './languageStorage';
import { interpolate, lookup } from './translationsUtils';

const CATALOGUES = { [LANGUAGE.EN]: en, [LANGUAGE.AR]: ar };

const I18nContext = createContext(null);

function useDocumentLanguage(lang, dir) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    persistLanguage(lang);
  }, [lang, dir]);
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(readPreferredLanguage);
  const dir = directionOf(lang);

  useDocumentLanguage(lang, dir);

  /** Translates a catalogue key, falling back to the default language. */
  const t = useCallback(
    (key, values) => {
      const template = lookup(CATALOGUES[lang], key) ?? lookup(CATALOGUES[DEFAULT_LANGUAGE], key);

      if (typeof template !== 'string') {
        if (import.meta.env.DEV) console.warn(`[i18n] missing key: ${key}`);
        return key;
      }
      return interpolate(template, values);
    },
    [lang],
  );

  /** Picks the current language out of a bilingual API field, e.g. { en, ar }. */
  const tx = useCallback(
    (field) => {
      if (field == null) return '';
      if (typeof field === 'string') return field;
      return field[lang] ?? field[DEFAULT_LANGUAGE] ?? '';
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, dir, setLang, t, tx }), [lang, dir, t, tx]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

I18nProvider.propTypes = {
  children: PropTypes.node,
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used inside <I18nProvider>');
  return context;
}
