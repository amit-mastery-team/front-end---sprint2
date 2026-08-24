import { useState } from 'react';
import { AsyncBoundary, Button, Callout, Hero } from '@/shared/components/ui';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';
import { useQuestionBank } from './hooks/useQuestionBank';
import NewQuestionDialog from './components/NewQuestionDialog';
import QuestionTable from './components/QuestionTable';

export default function QuestionBankPage() {
  const { t } = useI18n();
  const { notify } = useToast();
  const { questions, loading, error, reload, createQuestion, creating } = useQuestionBank();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Hero
        eyebrow={t('app.sprint')}
        title={t('bank.title')}
        lede={t('bank.lede')}
        goal={t('bank.goal')}
      />

      <div className="btn-row u-mb-3">
        <Button variant="primary" onClick={() => setDialogOpen(true)}>
          + {t('bank.new')}
        </Button>
        <Button onClick={() => notify(t('bank.importNote'))}>{t('bank.import')}</Button>
      </div>

      <AsyncBoundary
        loading={loading}
        error={error}
        onRetry={reload}
        isEmpty={questions.length === 0}
        emptyMessage={t('bank.empty')}
      >
        <QuestionTable questions={questions} />
      </AsyncBoundary>

      <Callout tone="warn">{t('bank.boundary')}</Callout>

      <NewQuestionDialog
        open={dialogOpen}
        pending={creating}
        onClose={() => setDialogOpen(false)}
        onSubmit={createQuestion}
      />
    </>
  );
}
