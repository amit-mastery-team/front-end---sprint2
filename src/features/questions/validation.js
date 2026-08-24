import { missingRequiredMetadata, validateAnswer } from '@/shared/constants/domain';

const ANSWER_ERROR_KEY = {
  options_min: 'bank.answerOptionsMin',
  correct_missing: 'bank.answerCorrectMissing',
  model_missing: 'bank.answerModelMissing',
  numeric_missing: 'bank.answerNumericMissing',
  rubric_missing: 'bank.answerRubricMissing',
  unknown_type: 'bank.validation',
};

/**
 * Client-side guards for a question draft.
 * Returns a translation key, or null when the draft can be submitted.
 * The server validates independently — this only avoids a pointless round trip.
 */
export function validateQuestionDraft(draft) {
  if (!draft.text?.trim()) return 'bank.validation';
  if (missingRequiredMetadata(draft)) return 'bank.metadataRequired';

  const answerError = validateAnswer(draft.type, draft.answer);
  return answerError ? ANSWER_ERROR_KEY[answerError] : null;
}
