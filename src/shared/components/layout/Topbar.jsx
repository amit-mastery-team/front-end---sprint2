import PropTypes from 'prop-types';
import LanguageSelect from './LanguageSelect';
import RoleSelect from './RoleSelect';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useRole } from '@/shared/context/RoleProvider';

export default function Topbar({ title }) {
  const { t } = useI18n();
  const { initials } = useRole();

  return (
    <header className="topbar">
      <div className="topbar__title">
        <h1>{title}</h1>
        <p>{t('app.subtitle')}</p>
      </div>

      <div className="topbar__actions">
        <LanguageSelect />
        <RoleSelect />
        <div className="avatar" aria-hidden="true">
          {initials}
        </div>
      </div>
    </header>
  );
}

Topbar.propTypes = {
  title: PropTypes.string.isRequired,
};
