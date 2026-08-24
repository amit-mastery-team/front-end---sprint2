import PropTypes from 'prop-types';
import { Badge, Button, Card, StatusBadge } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

/**
 * One practice screen. The "not graded" label is rendered here, on the
 * question itself, so it travels with every item — not just the page shell.
 */
export default function PracticeQuestionCard({ question, index, total, onPrevious, onNext }) {
  const { t, tx } = useI18n();

  return (
    <Card
      title={t('practice.questionOf', { current: index + 1, total })}
      headerSlot={<Badge tone="warn">{t('practice.label')}</Badge>}
    >
      <p className="prompt">{tx(question.text)}</p>

      <div className="btn-row">
        <Badge tone="info">{t(`source.${question.source}`)}</Badge>
        <StatusBadge status={question.status} />
      </div>

      <div className="btn-row u-mt-4">
        <Button onClick={onPrevious} disabled={index === 0}>
          {t('practice.previous')}
        </Button>
        <Button variant="primary" onClick={onNext} disabled={index === total - 1}>
          {t('practice.next')}
        </Button>
      </div>
    </Card>
  );
}

PracticeQuestionCard.propTypes = {
  question: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};
