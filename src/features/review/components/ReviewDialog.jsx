import PropTypes from 'prop-types';
import { Badge, Button, Callout, DescriptionList, Modal } from '@/shared/components/ui';
import { QUESTION_SOURCE, REVIEW_DECISION } from '@/shared/constants/domain';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function ReviewDialog({ question, canApprove, pending, onClose, onDecide }) {
  const { t, tx } = useI18n();

  if (!question) return null;

  const details = [
    {
      key: 'source',
      term: t('common.source'),
      description: (
        <Badge tone={question.source === QUESTION_SOURCE.AI ? 'info' : 'gold'}>
          {t(`source.${question.source}`)}
        </Badge>
      ),
    },
    { key: 'topic', term: t('common.topic'), description: t(`topics.${question.topic}`) },
    {
      key: 'difficulty',
      term: t('common.difficulty'),
      description: t(`difficulty.${question.difficulty}`),
    },
    { key: 'marks', term: t('common.marks'), description: question.marks },
  ];

  return (
    <Modal open onClose={onClose} title={t('review.reviewTitle', { id: question.id })}>
      <p className="prompt">{tx(question.text)}</p>
      <DescriptionList items={details} />

      {/* The button stays clickable for a non-approver: the server is the one
          that denies and audits the attempt, rather than the UI silently hiding it. */}
      {canApprove ? null : <Callout tone="warn">{t('review.denied')}</Callout>}

      <div className="btn-row u-mt-4">
        <Button variant="primary" disabled={pending} onClick={() => onDecide(REVIEW_DECISION.APPROVE)}>
          {t('common.approve')}
        </Button>
        <Button variant="danger" disabled={pending} onClick={() => onDecide(REVIEW_DECISION.REJECT)}>
          {t('common.reject')}
        </Button>
      </div>
    </Modal>
  );
}

ReviewDialog.propTypes = {
  question: PropTypes.object,
  canApprove: PropTypes.bool,
  pending: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDecide: PropTypes.func.isRequired,
};
