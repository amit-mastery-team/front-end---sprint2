/**
 * Domain vocabulary shared by the API layer and the UI.
 * These are codes, never display strings — every label comes from i18n.
 */

export const QUESTION_TYPE = Object.freeze({
  SINGLE: 'single',
  MULTIPLE: 'multiple',
  BOOLEAN: 'boolean',
  SHORT: 'short',
  NUMERIC: 'numeric',
  CODE: 'code',
});

export const TOPIC = Object.freeze({
  JOINS: 'joins',
  AGGREGATION: 'aggregation',
  FILTERING: 'filtering',
  GROUP_BY: 'group_by',
});

export const DIFFICULTY = Object.freeze({
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
});

export const QUESTION_STATUS = Object.freeze({
  DRAFT: 'draft',
  IN_REVIEW: 'in_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETIRED: 'retired',
});

export const QUESTION_SOURCE = Object.freeze({
  HUMAN: 'human',
  AI: 'ai',
});

export const ASSESSMENT_TYPE = Object.freeze({
  COURSE_EXAM: 'course_exam',
  SESSION_QUIZ: 'session_quiz',
  DIPLOMA_FINAL: 'diploma_final',
  PRACTICE_QUIZ: 'practice_quiz',
  DIAGNOSTIC: 'diagnostic',
});

export const ACADEMIC_LEVEL = Object.freeze({
  SESSION: 'session',
  COURSE: 'course',
  DIPLOMA: 'diploma',
});

export const REVIEW_DECISION = Object.freeze({
  APPROVE: 'approve',
  REJECT: 'reject',
});

/** Lifecycle of a quiz or assignment attached to a session/course/diploma. */
export const WORK_STATUS = Object.freeze({
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
});

/** The two kinds of assessment work a placement can hold. */
export const WORK_ITEM_KIND = Object.freeze({
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
});

/** Option lists for selects, in the order they should appear. */
export const QUESTION_TYPE_OPTIONS = Object.values(QUESTION_TYPE);
export const TOPIC_OPTIONS = Object.values(TOPIC);
export const DIFFICULTY_OPTIONS = Object.values(DIFFICULTY);
export const ASSESSMENT_TYPE_OPTIONS = Object.values(ASSESSMENT_TYPE);

/** Session quizzes, course exams and diploma finals share one blueprint and are never personalized. */
const GRADED_ASSESSMENT_TYPES = new Set([
  ASSESSMENT_TYPE.SESSION_QUIZ,
  ASSESSMENT_TYPE.COURSE_EXAM,
  ASSESSMENT_TYPE.DIPLOMA_FINAL,
]);

export const isGradedAssessmentType = (type) => GRADED_ASSESSMENT_TYPES.has(type);

/**
 * A graded assessment needs a complete blueprint before it can publish or
 * assemble: topic weights summing to 100%, every topic carrying at least one
 * item, and total marks set. Shared by the UI and the mock server so
 * "complete" can't drift between what's shown and what's enforced.
 */
export function blueprintCompleteness(blueprint) {
  const rows = blueprint?.rows ?? [];
  const reasons = [];

  if (rows.length === 0) reasons.push('no_topics');
  const weightSum = rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
  if (rows.length > 0 && weightSum !== 100) reasons.push('weight_sum');
  const emptyTopic = rows.some((row) => (row.easy || 0) + (row.medium || 0) + (row.hard || 0) === 0);
  if (emptyTopic) reasons.push('empty_topic');
  if (!Number(blueprint?.totalMarks)) reasons.push('total_marks');

  return { complete: reasons.length === 0, reasons };
}

/** Tabs of the review queue, in reviewer priority order. */
export const REVIEW_TABS = Object.freeze([
  QUESTION_STATUS.IN_REVIEW,
  QUESTION_STATUS.APPROVED,
  QUESTION_STATUS.REJECTED,
]);

/**
 * The single rule that decides graded eligibility.
 * Only approved items may enter a graded form — everything else is excluded.
 */
export const isGradedEligible = (status) => status === QUESTION_STATUS.APPROVED;

/** True when the draft is missing a piece of metadata every question must carry. */
export const missingRequiredMetadata = (draft) =>
  !draft.topic || !draft.difficulty || !Number(draft.marks) || !draft.language;

const optionsOf = (answer) => (answer.options ?? []).filter((option) => option.trim());

const validateSingle = (answer) => {
  const options = optionsOf(answer);
  if (options.length < 2) return 'options_min';
  return options.includes(answer.correct) ? null : 'correct_missing';
};

const validateMultiple = (answer) => {
  const options = optionsOf(answer);
  if (options.length < 2) return 'options_min';
  const correct = answer.correct ?? [];
  const valid = correct.length > 0 && correct.every((item) => options.includes(item));
  return valid ? null : 'correct_missing';
};

const validateBoolean = (answer) => (typeof answer.correct === 'boolean' ? null : 'correct_missing');
const validateShort = (answer) => (answer.modelAnswer?.trim() ? null : 'model_missing');
const validateNumeric = (answer) =>
  Number.isFinite(Number(answer.correct)) && answer.correct !== '' ? null : 'numeric_missing';
const validateCode = (answer) => (answer.rubric?.trim() ? null : 'rubric_missing');

const ANSWER_VALIDATOR_BY_TYPE = {
  [QUESTION_TYPE.SINGLE]: validateSingle,
  [QUESTION_TYPE.MULTIPLE]: validateMultiple,
  [QUESTION_TYPE.BOOLEAN]: validateBoolean,
  [QUESTION_TYPE.SHORT]: validateShort,
  [QUESTION_TYPE.NUMERIC]: validateNumeric,
  [QUESTION_TYPE.CODE]: validateCode,
};

/**
 * Checks the answer-key/rubric a draft carries against what its type requires.
 * Returns a neutral error code (not an i18n key — domain stays presentation-free),
 * or null when the answer is complete. Shared by client validation and the mock
 * server so the rule can't drift between the two.
 */
export function validateAnswer(type, answer = {}) {
  const validate = ANSWER_VALIDATOR_BY_TYPE[type];
  return validate ? validate(answer) : 'unknown_type';
}

/** Rendered as a reference table in the review queue. */
export const ELIGIBILITY_MATRIX = Object.freeze(
  Object.values(QUESTION_STATUS).map((status) => ({
    status,
    eligibility: isGradedEligible(status) ? 'eligible' : 'not_eligible',
  })),
);
