import { useCallback } from 'react';
import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { useMutation } from '@/shared/hooks/useMutation';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';
import { validateQuestionDraft } from '../validation';

/** Owns every bank read and write, so the page only composes components. */
export function useQuestionBank() {
  const { t } = useI18n();
  const { notifySuccess, notifyFailure } = useToast();
  const { data, loading, error, reload, setData } = useApi(() => api.listQuestions(), []);

  const prependQuestion = useCallback(
    (created) => setData((current) => ({ ...current, items: [created, ...(current?.items ?? [])] })),
    [setData],
  );

  const onSuccess = useCallback(
    (created) => {
      prependQuestion(created);
      notifySuccess(t('bank.saved'));
    },
    [prependQuestion, notifySuccess, t],
  );

  const onError = useCallback((failure) => notifyFailure(failure.message), [notifyFailure]);

  const createQuestion = useMutation(api.createQuestion, { onSuccess, onError });

  /** Rejects an invalid draft before it reaches the network. */
  const submitDraft = useCallback(
    (draft) => {
      const errorKey = validateQuestionDraft(draft);
      if (errorKey) {
        notifyFailure(t(errorKey));
        return Promise.resolve(undefined);
      }
      return createQuestion.run(draft);
    },
    [createQuestion, notifyFailure, t],
  );

  return {
    questions: data?.items ?? [],
    loading,
    error,
    reload,
    createQuestion: submitDraft,
    creating: createQuestion.pending,
  };
}
