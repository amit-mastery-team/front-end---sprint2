import { useCallback, useState } from 'react';
import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { useMutation } from '@/shared/hooks/useMutation';
import { useCountdown } from '@/shared/hooks/useCountdown';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';

const ATTEMPT_ID = 'current';

/**
 * Attempt runtime state.
 * The countdown is display-only — `remainingSeconds` from the server wins on every save.
 */
export function useAttempt() {
  const { t } = useI18n();
  const { notify, notifySuccess, notifyFailure } = useToast();
  const { data: attempt, loading, error, reload, setData } = useApi(() => api.getAttempt(ATTEMPT_ID), []);

  const [choice, setChoice] = useState(null);
  const [disconnected, setDisconnected] = useState(false);

  const handleExpiry = useCallback(() => notifyFailure(t('attempt.timeUp')), [notifyFailure, t]);

  const timer = useCountdown(attempt?.remainingSeconds, {
    running: Boolean(attempt) && !attempt.submitted && !disconnected,
    onExpire: handleExpiry,
  });

  const answer = useMutation(
    (optionId) => api.saveAnswer(ATTEMPT_ID, attempt.question.id, optionId),
    {
      onSuccess: (result) => {
        setData((current) => ({
          ...current,
          lastSavedAt: result.savedAt,
          currentIndex: result.currentIndex ?? current.currentIndex,
          remainingSeconds: result.remainingSeconds ?? current.remainingSeconds,
        }));
        notifySuccess(t('attempt.answerSaved'));
      },
      onError: (failure) => notifyFailure(failure.message),
    },
  );

  const submission = useMutation(() => api.submitAttempt(ATTEMPT_ID), {
    onSuccess: () => {
      setData((current) => ({ ...current, submitted: true }));
      notifySuccess(t('attempt.submitted'));
    },
    onError: (failure) => notifyFailure(failure.message),
  });

  const saveAnswer = useCallback(() => {
    if (!choice) {
      notifyFailure(t('attempt.selectFirst'));
      return undefined;
    }
    return answer.run(choice);
  }, [answer, choice, notifyFailure, t]);

  const reconnect = useCallback(() => {
    setDisconnected(false);
    notify(t('attempt.reconnected'));
  }, [notify, t]);

  const locked = Boolean(attempt?.submitted) || timer.isExpired;

  return {
    attempt,
    loading,
    error,
    reload,
    timer,
    choice,
    setChoice,
    saveAnswer,
    saving: answer.pending,
    submit: submission.run,
    submitting: submission.pending,
    locked,
    disconnected,
    disconnect: () => setDisconnected(true),
    dismissDisconnect: () => setDisconnected(false),
    reconnect,
  };
}
