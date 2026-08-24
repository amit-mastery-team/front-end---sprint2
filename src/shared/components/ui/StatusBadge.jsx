import PropTypes from 'prop-types';
import Badge from './Badge';
import { STATUS_TONE } from '@/shared/constants/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

/** Renders a status code with its agreed tone and translated label. */
export default function StatusBadge({ status }) {
  const { t } = useI18n();
  return <Badge tone={STATUS_TONE[status] ?? 'info'}>{t(`status.${status}`)}</Badge>;
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};
