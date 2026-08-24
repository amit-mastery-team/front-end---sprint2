import { USE_MOCK } from './config';
import * as mockApi from './mock/mockApi';
import * as httpApi from './httpApi';

/**
 * The only module that knows whether data is mocked.
 * Both implementations satisfy the same contract, so flipping VITE_USE_MOCK
 * requires no change anywhere else in the app.
 */
export const api = USE_MOCK ? mockApi : httpApi;

export { USE_MOCK } from './config';
export { ApiError, ERROR_CODE } from './ApiError';
