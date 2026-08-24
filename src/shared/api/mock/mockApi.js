import { ApiError, ERROR_CODE } from '../ApiError';
import { MOCK_LATENCY_MS } from '../config';
import {
  ACADEMIC_LEVEL,
  QUESTION_SOURCE,
  QUESTION_STATUS,
  REVIEW_DECISION,
  TOPIC,
  WORK_ITEM_KIND,
  WORK_STATUS,
  blueprintCompleteness,
  isGradedAssessmentType,
  missingRequiredMetadata,
  validateAnswer,
} from '@/shared/constants/domain';
import { ROLE, actorEmailFor, canApproveQuestions } from '@/shared/constants/roles';
import { nextQuestionId, nextWorkItemId, store } from './store';

/**
 * In-memory implementation of the application API.
 * Mirrors httpApi.js exactly — same names, same arguments, same return shapes.
 */

/** Resolves after the configured latency with a detached copy, so callers cannot mutate the store. */
const respond = (value) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), MOCK_LATENCY_MS));

/** Rejects after the configured latency, matching the timing of a real failure. */
const fail = (error) => new Promise((_, reject) => setTimeout(() => reject(error), MOCK_LATENCY_MS));

const matches = (question, { status, topic }) =>
  (!status || question.status === status) && (!topic || question.topic === topic);

/* Audit — every authentication event and every authorization-denied event lands here. */

/** Fixed per-role network location; a real backend would read this off the request instead. */
const SOURCE_ADDRESS = Object.freeze({
  [ROLE.INSTRUCTOR]: '10.20.14.31',
  [ROLE.REVIEWER]: '10.20.14.47',
  [ROLE.ACADEMIC_ADMIN]: '10.20.14.9',
  [ROLE.STUDENT]: '203.0.113.118',
  [ROLE.SYSTEM_ADMIN]: '10.20.14.2',
});

const sourceAddressFor = (role) => SOURCE_ADDRESS[role] ?? '0.0.0.0';
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function pushAudit({ role, action, outcome, detail }) {
  const entry = { time: nowTime(), user: actorEmailFor(role), action, outcome, detail, source: sourceAddressFor(role) };
  store.set('audit', [entry, ...store.get('audit')]);
  return entry;
}

/* Question bank */

export function listQuestions(filters = {}) {
  const items = store.get('questions').filter((item) => matches(item, filters));
  return respond({ items, counts: store.get('counts') });
}

export function createQuestion(draft) {
  if (!draft?.text?.trim()) {
    return fail(new ApiError('Question text is required', { status: 422, code: ERROR_CODE.VALIDATION }));
  }
  if (missingRequiredMetadata(draft)) {
    return fail(
      new ApiError('Topic, difficulty, marks and language are all required.', {
        status: 422,
        code: ERROR_CODE.VALIDATION,
      }),
    );
  }
  const answerError = validateAnswer(draft.type, draft.answer);
  if (answerError) {
    return fail(
      new ApiError(`The answer key is incomplete for this question type (${answerError}).`, {
        status: 422,
        code: ERROR_CODE.VALIDATION,
      }),
    );
  }

  const created = {
    id: nextQuestionId(),
    text: { en: draft.text, ar: draft.text },
    type: draft.type,
    topic: draft.topic,
    difficulty: draft.difficulty,
    marks: Number(draft.marks),
    language: draft.language,
    answer: draft.answer,
    source: QUESTION_SOURCE.HUMAN, // immutable once written
    status: QUESTION_STATUS.DRAFT,
  };

  store.set('questions', [created, ...store.get('questions')]);
  store.patch('counts', { total: store.get('counts').total + 1 });
  return respond(created);
}

/* Review */

export function listReviewQueue(status) {
  const items = store.get('questions').filter((item) => item.status === status);
  return respond({ items, counts: store.get('counts') });
}

export function decideReview(questionId, decision, actorRole) {
  // Checked client-side too, so the UI never has to wait on a round trip to explain
  // itself — but the server is the one that actually decides and logs the denial.
  if (!canApproveQuestions(actorRole)) {
    pushAudit({
      role: actorRole,
      action: `POST /questions/${questionId}/review`,
      outcome: 'denied',
      detail: '403',
    });
    return fail(
      new ApiError('Only a Content Reviewer or Academic Administrator may decide a review.', {
        status: 403,
        code: ERROR_CODE.FORBIDDEN,
      }),
    );
  }

  const question = store.get('questions').find((item) => item.id === questionId);
  if (!question) {
    return fail(new ApiError('Question not found', { status: 404, code: ERROR_CODE.NOT_FOUND }));
  }

  const approved = decision === REVIEW_DECISION.APPROVE;
  question.status = approved ? QUESTION_STATUS.APPROVED : QUESTION_STATUS.REJECTED;

  const counts = store.get('counts');
  store.patch('counts', {
    inReview: Math.max(0, counts.inReview - 1),
    approved: counts.approved + (approved ? 1 : 0),
    rejected: counts.rejected + (approved ? 0 : 1),
  });

  return respond(question);
}

/* Blueprint */

export const getBlueprint = () => respond(store.get('blueprint'));

export function saveBlueprint(_assessmentId, blueprint) {
  if (isGradedAssessmentType(blueprint.assessmentType) && blueprint.personalized) {
    return fail(
      new ApiError('A graded assessment cannot be configured with per-student personalization.', {
        status: 422,
        code: ERROR_CODE.VALIDATION,
      }),
    );
  }

  // "Complete" is never trusted from the client — it is recomputed here from
  // the actual rows and marks, the same rule the UI uses to show the badge.
  const { complete } = blueprintCompleteness(blueprint);
  return respond(store.patch('blueprint', { ...blueprint, complete }));
}

export const getBankReadiness = () => respond(store.get('readiness'));

/* Assembly */

export const listForms = () => respond({ forms: store.get('forms'), checks: store.get('assemblyChecks') });

const DIFFICULTIES = ['easy', 'medium', 'hard'];
const FORM_LETTERS = 'ABCDEFGHIJ';

/** Tiny seeded PRNG (mulberry32) — same seed in, same sequence out, every time. */
function seededRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic shuffle: same array + same rng sequence always reorders the same way. */
function shuffled(items, rng) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Every question this blueprint's rows call for, or the exact cell that falls short. */
function checkSupply(blueprint, approvedByCell) {
  for (const row of blueprint.rows) {
    for (const difficulty of DIFFICULTIES) {
      const required = row[difficulty] ?? 0;
      const available = (approvedByCell[row.topic]?.[difficulty] ?? []).length;
      if (required > available) {
        return { topic: row.topic, difficulty, missing: required - available };
      }
    }
  }
  return null;
}

function buildEquivalenceChecks(forms, approvedById) {
  const marksOf = (form) => form.itemIds.reduce((sum, id) => sum + approvedById.get(id).marks, 0);
  const joinsWeightOf = (form) => {
    const joinsCount = form.itemIds.filter((id) => approvedById.get(id).topic === TOPIC.JOINS).length;
    return `${Math.round((joinsCount / form.itemIds.length) * 100)}%`;
  };
  const hardCountOf = (form) => form.itemIds.filter((id) => approvedById.get(id).difficulty === 'hard').length;
  const unapprovedCountOf = (form) =>
    form.itemIds.filter((id) => approvedById.get(id)?.status !== QUESTION_STATUS.APPROVED).length;

  return [
    { key: 'checkTotalMarks', values: forms.map(marksOf) },
    { key: 'checkWeight', values: forms.map(joinsWeightOf) },
    { key: 'checkHard', values: forms.map(hardCountOf) },
    { key: 'checkUnapproved', values: forms.map(unapprovedCountOf) },
  ];
}

/**
 * Deterministic multi-form assembly: same blueprint + same approved bank +
 * same seed always produces the same forms. Only Approved items are eligible;
 * a shortfall fails with the exact topic/difficulty/count rather than
 * substituting an ineligible item. Recently used items are deprioritised
 * (exposure control) so consecutive runs rotate content on their own.
 */
export function runAssembly(
  _assessmentId,
  { formCount = 2, seed = 1, randomizeOrder = false, simulateGap = false } = {},
) {
  const blueprint = store.get('blueprint');
  if (isGradedAssessmentType(blueprint.assessmentType) && !blueprintCompleteness(blueprint).complete) {
    return fail(
      new ApiError('This graded assessment cannot assemble: the blueprint is incomplete.', {
        status: 422,
        code: ERROR_CODE.VALIDATION,
      }),
    );
  }

  const approved = store.get('questions').filter((item) => item.status === QUESTION_STATUS.APPROVED);
  const approvedById = new Map(approved.map((item) => [item.id, item]));
  const approvedByCell = {};
  approved.forEach((item) => {
    approvedByCell[item.topic] ??= {};
    (approvedByCell[item.topic][item.difficulty] ??= []).push(item);
  });

  // A one-click stress test: pretend the bank's most requested cell needs one
  // more than it has. Goes through the exact same check as a real shortage.
  if (simulateGap) {
    const [firstRow] = blueprint.rows;
    const cell = approvedByCell[firstRow.topic]?.hard ?? [];
    return fail(
      new ApiError('Approved bank cannot satisfy the blueprint', {
        status: 409,
        code: ERROR_CODE.BANK_GAP,
        details: { topic: firstRow.topic, difficulty: 'hard', missing: (firstRow.hard || 1) + 1 - cell.length },
      }),
    );
  }

  const gap = checkSupply(blueprint, approvedByCell);
  if (gap) {
    return fail(
      new ApiError('Approved bank cannot satisfy the blueprint', {
        status: 409,
        code: ERROR_CODE.BANK_GAP,
        details: gap,
      }),
    );
  }

  const exposure = new Set(store.get('exposureLog'));
  const forms = [];

  for (let formIndex = 0; formIndex < formCount; formIndex += 1) {
    const formSeed = seed * 1000 + formIndex;
    const rng = seededRng(formSeed);
    const itemIds = [];

    blueprint.rows.forEach((row) => {
      DIFFICULTIES.forEach((difficulty) => {
        const count = row[difficulty] ?? 0;
        if (count === 0) return;
        const pool = approvedByCell[row.topic][difficulty];
        // Not-yet-exposed items sort first; ties break by the form's own seed
        // so different forms can still land on different eligible items.
        const ranked = shuffled(pool, rng).sort(
          (a, b) => Number(exposure.has(a.id)) - Number(exposure.has(b.id)),
        );
        itemIds.push(...ranked.slice(0, count).map((item) => item.id));
      });
    });

    const orderedIds = randomizeOrder ? shuffled(itemIds, seededRng(formSeed + 1)) : itemIds;

    forms.push({
      id: FORM_LETTERS[formIndex] ?? `F${formIndex + 1}`,
      items: orderedIds.length,
      marks: orderedIds.reduce((sum, id) => sum + approvedById.get(id).marks, 0),
      seed: formSeed,
      status: 'ready',
      itemIds: orderedIds,
      note: { en: 'approved items only', ar: 'أسئلة معتمدة بس' },
    });
  }

  const usedThisRun = new Set(forms.flatMap((form) => form.itemIds));
  store.set('exposureLog', Array.from(new Set([...exposure, ...usedThisRun])));

  const checks = buildEquivalenceChecks(forms, approvedById);
  store.set('forms', forms);
  store.set('assemblyChecks', checks);

  return respond({ forms, checks, created: forms.length });
}

/* Attempt */

export const getAttempt = () => respond(store.get('attempt'));

export function saveAnswer(_attemptId, questionId, answer) {
  if (!answer) {
    return fail(new ApiError('No answer supplied', { status: 422, code: ERROR_CODE.VALIDATION }));
  }

  const attempt = store.get('attempt');
  const updated = store.patch('attempt', {
    lastSavedAt: new Date().toISOString(),
    currentIndex: Math.min(attempt.currentIndex + 1, attempt.totalQuestions),
  });

  return respond({
    questionId,
    savedAt: updated.lastSavedAt,
    currentIndex: updated.currentIndex,
    remainingSeconds: updated.remainingSeconds,
  });
}

export function submitAttempt() {
  const attempt = store.patch('attempt', { submitted: true });
  return respond({ submitted: true, versionLocked: true, form: attempt.form });
}

/* Placement and security */

export const getPlacements = () => respond(store.get('placements'));

/**
 * Attaches a quiz or an assignment to a session/course/diploma. A session may
 * carry at most one quiz — everything else about the rule is enforced here,
 * not in the UI, so it holds even if a client skips its own check.
 */
export function attachWorkItem(placementId, kind, name) {
  if (!name?.trim()) {
    return fail(new ApiError('A name is required.', { status: 422, code: ERROR_CODE.VALIDATION }));
  }

  const placement = store.get('placements').find((item) => item.id === placementId);
  if (!placement) {
    return fail(new ApiError('Placement not found', { status: 404, code: ERROR_CODE.NOT_FOUND }));
  }

  const item = { id: nextWorkItemId(), name: { en: name, ar: name }, status: WORK_STATUS.DRAFT };

  if (kind === WORK_ITEM_KIND.QUIZ) {
    if (placement.level !== ACADEMIC_LEVEL.SESSION) {
      return fail(
        new ApiError('A quiz can only be attached at session level.', {
          status: 422,
          code: ERROR_CODE.VALIDATION,
        }),
      );
    }
    if (placement.quiz) {
      return fail(
        new ApiError('This session already has a quiz definition — only one is allowed per session.', {
          status: 409,
          code: ERROR_CODE.VALIDATION,
        }),
      );
    }
    placement.quiz = item;
    return respond(placement);
  }

  placement.assignments = [...placement.assignments, item];
  return respond(placement);
}
export const getSecurityOverview = () => respond(store.get('security'));
export const listAudit = () => respond(store.get('audit'));

/**
 * Step-up check for Academic Administrator / System Administrator: the password
 * step already happened, this is the time-based code that must follow it.
 * Every attempt — success or failure — is an authentication event and is logged.
 */
export function verifyMfaCode(role, code) {
  const valid = code === store.get('security').demoMfaCode;

  pushAudit({
    role,
    action: 'MFA challenge',
    outcome: valid ? 'success' : 'denied',
    detail: valid ? '200' : '401',
  });

  if (!valid) {
    return fail(
      new ApiError('That code is invalid or has expired.', { status: 401, code: ERROR_CODE.FORBIDDEN }),
    );
  }

  return respond({ verified: true });
}
