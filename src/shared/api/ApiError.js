/** Error codes the UI branches on. Anything else is treated as a generic failure. */
export const ERROR_CODE = Object.freeze({
  NETWORK: 'network',
  VALIDATION: 'validation',
  NOT_FOUND: 'not_found',
  FORBIDDEN: 'forbidden',
  BANK_GAP: 'bank_gap',
  UNKNOWN: 'unknown',
});

/** A single error shape for both the mock and HTTP implementations. */
export class ApiError extends Error {
  constructor(message, { status = 0, code = ERROR_CODE.UNKNOWN, details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }

  is(code) {
    return this.code === code;
  }
}
