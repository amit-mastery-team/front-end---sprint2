import { AsyncBoundary, Badge, Hero } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { usePracticeQueue } from './hooks/usePracticeQueue';
import PracticeQuestionCard from './components/PracticeQuestionCard';

export default function PracticeQuizPage() {
  const { t } = useI18n();
  const { current, index, total, loading, error, reload, next, previous } = usePracticeQueue();

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('practice.title')}
        lede={t('practice.lede')}
        goal={t('practice.goal')}
      />

      {/* Repeated on the page shell too — the label must be visible on every
          screen this flow can show, including the loading/empty states. */}
      <Badge tone="warn">{t('practice.label')}</Badge>

      <div className="u-mt-3">
        <AsyncBoundary
          loading={loading}
          error={error}
          onRetry={reload}
          isEmpty={total === 0}
          emptyMessage={t('practice.empty')}
        >
          {current ? (
            <PracticeQuestionCard
              question={current}
              index={index}
              total={total}
              onPrevious={previous}
              onNext={next}
            />
          ) : null}
        </AsyncBoundary>
      </div>
    </>
  );
}
