import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { AsyncBoundary, Hero, SectionTitle } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';
import AuditTable from './components/AuditTable';
import SecurityOverview from './components/SecurityOverview';

export default function SecurityPage() {
  const { t } = useI18n();
  const overview = useApi(() => api.getSecurityOverview(), []);
  const audit = useApi(() => api.listAudit(), []);

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('security.title')}
        lede={t('security.lede')}
        goal={t('security.goal')}
      />

      <AsyncBoundary loading={overview.loading} error={overview.error} onRetry={overview.reload}>
        {overview.data ? <SecurityOverview overview={overview.data} /> : null}
      </AsyncBoundary>

      <SectionTitle>{t('security.recent')}</SectionTitle>

      <AsyncBoundary loading={audit.loading} error={audit.error} onRetry={audit.reload}>
        <AuditTable entries={audit.data ?? []} />
      </AsyncBoundary>
    </>
  );
}
