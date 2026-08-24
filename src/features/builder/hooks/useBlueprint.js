import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { useMutation } from '@/shared/hooks/useMutation';
import { useI18n } from '@/shared/i18n/I18nProvider';
import { useToast } from '@/shared/context/ToastProvider';
import { blueprintCompleteness, isGradedAssessmentType } from '@/shared/constants/domain';

const ASSESSMENT_ID = 'current';

/** Loads the blueprint, keeps the editable copy, and saves it back. */
export function useBlueprint() {
  const { t } = useI18n();
  const { notifySuccess, notifyFailure } = useToast();
  const { data, loading, error, reload } = useApi(() => api.getBlueprint(ASSESSMENT_ID), []);

  const [draft, setDraft] = useState(null);

  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const setField = useCallback((field, value) => {
    setDraft((current) => {
      // A graded type never carries personalization, whether that's because the
      // type just changed or because personalized was set directly while graded.
      const next = { ...current, [field]: value };
      const willBeGraded = isGradedAssessmentType(field === 'assessmentType' ? value : current.assessmentType);
      if (willBeGraded) next.personalized = false;
      return next;
    });
  }, []);

  const setRow = useCallback((topic, field, value) => {
    setDraft((current) => ({
      ...current,
      rows: current.rows.map((row) => (row.topic === topic ? { ...row, [field]: value } : row)),
    }));
  }, []);

  const isGraded = isGradedAssessmentType(draft?.assessmentType);
  const { complete, reasons } = useMemo(() => blueprintCompleteness(draft ?? {}), [draft]);

  const save = useMutation((blueprint) => api.saveBlueprint(ASSESSMENT_ID, blueprint), {
    onSuccess: (saved) => {
      setDraft(saved);
      notifySuccess(t('builder.blueprintSaved'));
    },
    onError: (failure) => notifyFailure(failure.message),
  });

  const canAssemble = !isGraded || complete;

  return {
    blueprint: draft,
    loading: loading || !draft,
    error,
    reload,
    setField,
    setRow,
    save: () => save.run(draft),
    saving: save.pending,
    isGraded,
    complete,
    incompleteReasons: reasons,
    canAssemble,
  };
}
