import { useCallback, useState } from 'react';
import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { useMutation } from '@/shared/hooks/useMutation';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';

/** Owns placement reads and the attach-quiz / add-assignment writes. */
export function usePlacements() {
  const { t } = useI18n();
  const { notifySuccess, notifyFailure } = useToast();
  const { data, loading, error, reload, setData } = useApi(() => api.getPlacements(), []);

  // { placementId, kind } while the attach dialog is open; null otherwise.
  const [target, setTarget] = useState(null);

  const applyUpdate = useCallback(
    (updatedPlacement) =>
      setData((current) =>
        (current ?? []).map((item) => (item.id === updatedPlacement.id ? updatedPlacement : item)),
      ),
    [setData],
  );

  const onSuccess = useCallback(
    (updatedPlacement) => {
      applyUpdate(updatedPlacement);
      notifySuccess(t('work.attached'));
      setTarget(null);
    },
    [applyUpdate, notifySuccess, t],
  );

  const onError = useCallback((failure) => notifyFailure(failure.message), [notifyFailure]);

  const attach = useMutation((name) => api.attachWorkItem(target.placementId, target.kind, name), {
    onSuccess,
    onError,
  });

  return {
    placements: data ?? [],
    loading,
    error,
    reload,
    target,
    openDialog: setTarget,
    closeDialog: () => setTarget(null),
    attach: attach.run,
    attaching: attach.pending,
  };
}
