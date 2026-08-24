import { API_BASE_URL } from './config';
import { ApiError, ERROR_CODE } from './ApiError';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** Serialises defined values only, so callers can pass optional filters freely. */
export function toQueryString(params = {}) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
  return entries.length ? `?${new URLSearchParams(entries)}` : '';
}

async function parseBody(response) {
  if (response.status === 204) return null;
  return response.json().catch(() => null);
}

function toApiError(response, body) {
  return new ApiError(body?.message || `Request failed (${response.status})`, {
    status: response.status,
    code: body?.code || ERROR_CODE.UNKNOWN,
    details: body?.details ?? null,
  });
}

/** The single place that talks to fetch. Everything else composes on top of it. */
export async function request(path, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal,
      credentials: 'include',
      headers: body ? JSON_HEADERS : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (cause) {
    throw new ApiError('Network unreachable', { code: ERROR_CODE.NETWORK, details: cause?.message });
  }

  const parsed = await parseBody(response);
  if (!response.ok) throw toApiError(response, parsed);
  return parsed;
}
