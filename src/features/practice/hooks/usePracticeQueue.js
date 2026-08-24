import { useMemo, useState } from 'react';
import { api } from '@/shared/api';
import { useApi } from '@/shared/hooks/useApi';
import { isGradedEligible } from '@/shared/constants/domain';

/**
 * Practice draws only from the unapproved pool — an item that has cleared
 * review belongs to graded assembly, not here. There is no separate "practice
 * bank" to keep in sync: eligibility is the same one rule as everywhere else,
 * just read the other way round.
 */
export function usePracticeQueue() {
  const { data, loading, error, reload } = useApi(() => api.listQuestions(), []);
  const [index, setIndex] = useState(0);

  const items = useMemo(
    () => (data?.items ?? []).filter((question) => !isGradedEligible(question.status)),
    [data],
  );

  const current = items[index] ?? null;

  return {
    items,
    current,
    index,
    total: items.length,
    loading,
    error,
    reload,
    next: () => setIndex((value) => Math.min(value + 1, items.length - 1)),
    previous: () => setIndex((value) => Math.max(value - 1, 0)),
  };
}
