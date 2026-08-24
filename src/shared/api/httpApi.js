import { request, toQueryString } from './httpClient';

/**
 * HTTP implementation of the application API.
 * Mirrors mock/mockApi.js exactly — same names, same arguments, same return shapes.
 */

/* Question bank */
export const listQuestions = (filters = {}) => request(`/questions${toQueryString(filters)}`);

export const createQuestion = (draft) => request('/questions', { method: 'POST', body: draft });

/* Review */
export const listReviewQueue = (status) => request(`/questions/review${toQueryString({ status })}`);

export const decideReview = (questionId, decision, actorRole) =>
  request(`/questions/${questionId}/review`, { method: 'POST', body: { decision, actorRole } });

/* Blueprint */
export const getBlueprint = (assessmentId) => request(`/assessments/${assessmentId}/blueprint`);

export const saveBlueprint = (assessmentId, blueprint) =>
  request(`/assessments/${assessmentId}/blueprint`, { method: 'PUT', body: blueprint });

export const getBankReadiness = () => request('/bank/readiness');

/* Assembly */
export const listForms = (assessmentId) => request(`/assessments/${assessmentId}/forms`);

export const runAssembly = (assessmentId, options = {}) =>
  request(`/assessments/${assessmentId}/forms:assemble`, { method: 'POST', body: options });

/* Attempt */
export const getAttempt = (attemptId) => request(`/attempts/${attemptId}`);

export const saveAnswer = (attemptId, questionId, answer) =>
  request(`/attempts/${attemptId}/answers/${questionId}`, { method: 'PUT', body: { answer } });

export const submitAttempt = (attemptId) => request(`/attempts/${attemptId}:submit`, { method: 'POST' });

/* Placement and security */
export const getPlacements = () => request('/placements');

export const attachWorkItem = (placementId, kind, name) =>
  request(`/placements/${placementId}/${kind}`, { method: 'POST', body: { name } });
export const getSecurityOverview = () => request('/security/overview');
export const listAudit = () => request('/security/audit');

export const verifyMfaCode = (role, code) =>
  request('/security/mfa/verify', { method: 'POST', body: { role, code } });
