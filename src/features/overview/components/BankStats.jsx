import PropTypes from 'prop-types';
import { Badge, Card, Metric } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

/** Stat definitions live next to the only screen that renders them. */
const STATS = [
  { key: 'statBank', tone: 'red', read: (counts) => counts.total },
  { key: 'statReview', tone: 'warn', read: (counts) => counts.inReview },
  { key: 'statApproved', tone: 'ok', read: (counts) => counts.approved },
  { key: 'statAttempts', tone: 'info', read: null },
];

export default function BankStats({ counts }) {
  const { t } = useI18n();

  return (
    <div className="grid g4">
      {STATS.map((stat) => (
        <Card key={stat.key} headerSlot={<Badge tone={stat.tone}>{t(`overview.${stat.key}`)}</Badge>}>
          <Metric value={stat.read ? stat.read(counts) : t('overview.statAttemptsValue')} />
          <p>{t(`overview.${stat.key}Note`)}</p>
        </Card>
      ))}
    </div>
  );
}

BankStats.propTypes = {
  counts: PropTypes.shape({
    total: PropTypes.number,
    inReview: PropTypes.number,
    approved: PropTypes.number,
  }).isRequired,
};
