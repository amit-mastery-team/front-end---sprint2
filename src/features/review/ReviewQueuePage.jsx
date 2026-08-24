import { AsyncBoundary, Callout, Hero, Tabs } from '@/shared/components/ui';
import { REVIEW_TABS } from '@/shared/constants/domain';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useReviewQueue } from './hooks/useReviewQueue';
import EligibilityCard from './components/EligibilityCard';
import ReviewDialog from './components/ReviewDialog';
import ReviewList from './components/ReviewList';

const COUNT_BY_STATUS = {
  in_review: (counts) => counts?.inReview,
  approved: (counts) => counts?.approved,
  rejected: (counts) => counts?.rejected,
};

export default function ReviewQueuePage() {
  const { t } = useI18n();
  const queue = useReviewQueue();

  const tabs = REVIEW_TABS.map((status) => ({
    value: status,
    label: t(`status.${status}`),
    count: COUNT_BY_STATUS[status]?.(queue.counts),
  }));

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('review.title')}
        lede={t('review.lede')}
        goal={t('review.goal')}
      />

      <div className="split">
        <div>
          <Tabs items={tabs} value={queue.status} onChange={queue.setStatus} label={t('review.title')} />

          <AsyncBoundary
            loading={queue.loading}
            error={queue.error}
            onRetry={queue.reload}
            isEmpty={queue.items.length === 0}
            emptyMessage={t('review.empty')}
          >
            <ReviewList items={queue.items} onSelect={queue.setSelected} />
          </AsyncBoundary>

          {queue.canApprove ? null : <Callout tone="warn">{t('review.denied')}</Callout>}
        </div>

        <EligibilityCard />
      </div>

      <ReviewDialog
        question={queue.selected}
        canApprove={queue.canApprove}
        pending={queue.deciding}
        onClose={() => queue.setSelected(null)}
        onDecide={queue.decide}
      />
    </>
  );
}
