import { AsyncBoundary, Callout, Hero } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useAttempt } from './hooks/useAttempt';
import AttemptQuestionCard from './components/AttemptQuestionCard';
import AttemptStateCard from './components/AttemptStateCard';
import DisconnectDialog from './components/DisconnectDialog';

export default function StudentAttemptPage() {
  const { t } = useI18n();
  const runtime = useAttempt();

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('attempt.title')}
        lede={t('attempt.lede')}
        goal={t('attempt.goal')}
      />

      <AsyncBoundary loading={runtime.loading} error={runtime.error} onRetry={runtime.reload}>
        {runtime.attempt ? (
          <div className="split">
            <AttemptQuestionCard
              attempt={runtime.attempt}
              timer={runtime.timer}
              choice={runtime.choice}
              locked={runtime.locked}
              saving={runtime.saving}
              submitting={runtime.submitting}
              onChoose={runtime.setChoice}
              onSave={runtime.saveAnswer}
              onDisconnect={runtime.disconnect}
              onSubmit={runtime.submit}
            />

            <div className="stack">
              <AttemptStateCard attempt={runtime.attempt} />
              <Callout tone="warn">{t('attempt.tampering')}</Callout>
            </div>
          </div>
        ) : null}
      </AsyncBoundary>

      <DisconnectDialog
        open={runtime.disconnected}
        onClose={runtime.dismissDisconnect}
        onReconnect={runtime.reconnect}
      />
    </>
  );
}
