/** Reads the environment once, so no other module touches import.meta.env. */

const flag = import.meta.env.VITE_USE_MOCK;

export const USE_MOCK = flag === undefined ? true : String(flag) !== 'false';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const MOCK_LATENCY_MS = Number(import.meta.env.VITE_MOCK_LATENCY ?? 300);
