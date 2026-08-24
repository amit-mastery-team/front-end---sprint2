import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { AsyncBoundary, Callout, Hero, SectionTitle } from '@/shared/components/ui';
import BankStats from './components/BankStats';
import JourneySteps from './components/JourneySteps';

const EMPTY_COUNTS = { total: 0, inReview: 0, approved: 0 };

export default function OverviewPage() {
  const { t } = useI18n();
  const { data, loading, error, reload } = useApi(() => api.listQuestions(), []);

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('overview.title')}
        lede={t('overview.lede')}
        goal={t('overview.goal')}
      />

      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <BankStats counts={data?.counts ?? EMPTY_COUNTS} />
      </AsyncBoundary>

      <SectionTitle note={t('overview.journeyNote')}>{t('overview.journey')}</SectionTitle>
      <JourneySteps />

      <Callout tone="info">{t('overview.decision')}</Callout>
    </>
  );
}
