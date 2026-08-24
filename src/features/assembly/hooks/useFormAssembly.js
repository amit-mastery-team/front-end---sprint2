import { useCallback, useState } from 'react';
import { api, ERROR_CODE } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { useMutation } from '@/shared/hooks/useMutation';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';

const ASSESSMENT_ID = 'current';

/** Runs assembly and turns a bank-gap failure into dialog state rather than a toast. */
export function useFormAssembly() {
  const { t } = useI18n();
  const { notifySuccess, notifyFailure } = useToast();
  const { data, loading, error, reload, setData } = useApi(() => api.listForms(ASSESSMENT_ID), []);

  const [gap, setGap] = useState(null);
  const [formCount, setFormCount] = useState(2);
  const [seed, setSeed] = useState(1);
  const [randomizeOrder, setRandomizeOrder] = useState(false);

  const onSuccess = useCallback(
    (result) => {
      setData({ forms: result.forms, checks: result.checks });
      setGap(null);
      notifySuccess(t('assembly.success', { count: result.created ?? result.forms.length }));
    },
    [notifySuccess, setData, t],
  );

  const onError = useCallback(
    (failure) => {
      if (failure.code === ERROR_CODE.BANK_GAP) {
        setGap(failure.details);
        return;
      }
      notifyFailure(failure.message);
    },
    [notifyFailure],
  );

  const assembly = useMutation((options) => api.runAssembly(ASSESSMENT_ID, options), {
    onSuccess,
    onError,
  });

  return {
    forms: data?.forms ?? [],
    checks: data?.checks ?? [],
    loading,
    error,
    reload,
    gap,
    clearGap: () => setGap(null),
    formCount,
    setFormCount,
    seed,
    setSeed,
    randomizeOrder,
    setRandomizeOrder,
    run: (options = {}) => assembly.run({ formCount, seed, randomizeOrder, ...options }),
    running: assembly.pending,
  };
}
