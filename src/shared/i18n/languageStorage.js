import { DEFAULT_LANGUAGE, LANGUAGE, LANGUAGE_STORAGE_KEY, LANGUAGES } from './languages';

const isSupported = (code) => LANGUAGES.some((language) => language.code === code);

/** Stored choice first, then the browser preference, then the default. */
export function readPreferredLanguage() {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupported(stored)) return stored;
  } catch {
    // Storage can be blocked; fall through to detection.
  }

  const browser = globalThis.navigator?.language ?? '';
  return browser.startsWith(LANGUAGE.AR) ? LANGUAGE.AR : DEFAULT_LANGUAGE;
}

export function persistLanguage(code) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch {
    // Persisting is a convenience, never a requirement.
  }
}
