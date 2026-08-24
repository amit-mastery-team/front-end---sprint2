import { useCallback, useState } from 'react';
import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { useMutation } from '@/shared/hooks/useMutation';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useRole } from '@/shared/context/RoleProvider';
import { useToast } from '@/shared/context/ToastProvider';
import { QUESTION_STATUS, REVIEW_DECISION } from '@/shared/constants/domain';

/** Owns the queue tab, the selection and the approve/reject decision. */
export function useReviewQueue() {
  const { t } = useI18n();
  const { role, canApprove } = useRole();
  const { notifySuccess, notifyFailure } = useToast();

  const [status, setStatus] = useState(QUESTION_STATUS.IN_REVIEW);
  const [selected, setSelected] = useState(null);

  const { data, loading, error, reload } = useApi(() => api.listReviewQueue(status), [status]);

  const onSuccess = useCallback(
    (_result, _id, decision) => {
      setSelected(null);
      notifySuccess(decision === REVIEW_DECISION.APPROVE ? t('review.approved') : t('review.rejected'));
      reload();
    },
    [notifySuccess, reload, t],
  );

  const onError = useCallback((failure) => notifyFailure(failure.message), [notifyFailure]);

  const review = useMutation(api.decideReview, { onSuccess, onError });

  /**
   * The role is passed through on every call, not just checked before it: the
   * server is the one that actually enforces eligibility and, when it denies
   * the attempt, logs it to the audit trail.
   */
  const decide = useCallback(
    (decision) => review.run(selected.id, decision, role),
    [review, role, selected],
  );

  return {
    status,
    setStatus,
    items: data?.items ?? [],
    counts: data?.counts,
    loading,
    error,
    reload,
    selected,
    setSelected,
    canApprove,
    decide,
    deciding: review.pending,
  };
}
