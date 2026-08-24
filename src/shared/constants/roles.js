/** Demo roles and the two permissions the Sprint 2 screens actually gate on. */

export const ROLE = Object.freeze({
  INSTRUCTOR: 'instructor',
  REVIEWER: 'reviewer',
  ACADEMIC_ADMIN: 'academicAdmin',
  STUDENT: 'student',
  SYSTEM_ADMIN: 'systemAdmin',
});

export const ROLE_OPTIONS = Object.values(ROLE);

/** An instructor cannot approve their own item; only these roles decide. */
const APPROVER_ROLES = new Set([ROLE.REVIEWER, ROLE.ACADEMIC_ADMIN]);

/** Privileged roles must clear an MFA challenge after the password step. */
const MFA_ROLES = new Set([ROLE.ACADEMIC_ADMIN, ROLE.SYSTEM_ADMIN]);

export const canApproveQuestions = (role) => APPROVER_ROLES.has(role);
export const requiresMfa = (role) => MFA_ROLES.has(role);

/** Stand-in identity for the demo role, used wherever an audit event needs a "user". */
const ACTOR_EMAIL = Object.freeze({
  [ROLE.INSTRUCTOR]: 'instructor@demo',
  [ROLE.REVIEWER]: 'reviewer@demo',
  [ROLE.ACADEMIC_ADMIN]: 'academic.admin@demo',
  [ROLE.STUDENT]: 'student@demo',
  [ROLE.SYSTEM_ADMIN]: 'system.admin@demo',
});

export const actorEmailFor = (role) => ACTOR_EMAIL[role] ?? 'unknown@demo';
