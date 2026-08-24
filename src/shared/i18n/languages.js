export const LANGUAGE = Object.freeze({
  EN: 'en',
  AR: 'ar',
});

export const LANGUAGES = Object.freeze([
  { code: LANGUAGE.EN, dir: 'ltr' },
  { code: LANGUAGE.AR, dir: 'rtl' },
]);

export const DEFAULT_LANGUAGE = LANGUAGE.EN;
export const LANGUAGE_STORAGE_KEY = 'amit.lang';

export const directionOf = (code) =>
  LANGUAGES.find((language) => language.code === code)?.dir ?? 'ltr';
