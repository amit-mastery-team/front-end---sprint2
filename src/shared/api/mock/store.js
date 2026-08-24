import { seed } from './seed';

/** Mutable in-memory state for the mock layer, seeded once per page load. */
const state = structuredClone(seed);

let lastQuestionNumber = 1051;
let lastWorkItemNumber = 4;

export const store = {
  get: (key) => state[key],
  set: (key, value) => {
    state[key] = value;
    return value;
  },
  patch: (key, partial) => {
    state[key] = { ...state[key], ...partial };
    return state[key];
  },
};

export function nextQuestionId() {
  lastQuestionNumber += 1;
  return `QB-${lastQuestionNumber}`;
}

export function nextWorkItemId() {
  lastWorkItemNumber += 1;
  return `asg-${lastWorkItemNumber}`;
}
