import { useI18n } from '@/shared/i18n/I18nProvider';
import { LANGUAGES } from '@/shared/i18n/languages';

export default function LanguageSelect() {
  const { t, lang, setLang } = useI18n();

  return (
    <>
      <label className="visually-hidden" htmlFor="language-select">
        {t('lang.label')}
      </label>
      <select
        id="language-select"
        className="select-control"
        value={lang}
        onChange={(event) => setLang(event.target.value)}
      >
        {LANGUAGES.map(({ code }) => (
          <option key={code} value={code}>
            {t(`lang.${code}`)}
          </option>
        ))}
      </select>
    </>
  );
}
