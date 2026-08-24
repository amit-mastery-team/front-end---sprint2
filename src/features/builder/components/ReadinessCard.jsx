import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { AsyncBoundary, Card, Progress } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';

export default function ReadinessCard() {
  const { t } = useI18n();
  const { data, loading, error, reload } = useApi(() => api.getBankReadiness(), []);

  return (
    <Card title={t('builder.readiness')}>
      <AsyncBoundary loading={loading} error={error} onRetry={reload}>
        <div className="stack">
          {(data ?? []).map((row) => (
            <Progress key={row.topic} label={t(`topics.${row.topic}`)} percent={row.percent} />
          ))}
        </div>
      </AsyncBoundary>
    </Card>
  );
}
