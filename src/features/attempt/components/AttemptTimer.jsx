import PropTypes from 'prop-types';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function AttemptTimer({ label, isLow }) {
  const { t } = useI18n();

  return (
    <div className="attempt__timer">
      <b className={`timer ${isLow ? 'timer--low' : ''}`.trim()}>{label}</b>
      <div className="small">{t('attempt.serverTime')}</div>
    </div>
  );
}

AttemptTimer.propTypes = {
  label: PropTypes.string.isRequired,
  isLow: PropTypes.bool,
};
