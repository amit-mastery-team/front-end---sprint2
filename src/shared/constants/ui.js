/** Presentation-only constants. No magic numbers scattered through components. */

export const TOAST_DURATION_MS = 3200;

export const TOAST_TONE = Object.freeze({
  NEUTRAL: 'neutral',
  OK: 'ok',
  BAD: 'bad',
});

export const BADGE_TONES = Object.freeze([
  'ok',
  'warn',
  'bad',
  'info',
  'red',
  'gold',
]);

/** Bank status -> badge tone. The colour rule lives here and nowhere else. */
export const STATUS_TONE = Object.freeze({
  approved: 'ok',
  in_review: 'warn',
  draft: 'red',
  rejected: 'bad',
  retired: 'bad',
  eligible: 'ok',
  not_eligible: 'bad',
  ready: 'ok',
  open: 'ok',
  closed: 'info',
});

/** Academic level -> badge tone. */
export const LEVEL_TONE = Object.freeze({
  session: 'red',
  course: 'gold',
  diploma: 'info',
});

/** Below this many seconds the attempt timer turns red. */
export const TIMER_WARNING_SECONDS = 60;
