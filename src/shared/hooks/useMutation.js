import { useCallback, useRef, useState } from 'react';

/**
 * Wraps a write so components stop repeating try/catch/pending bookkeeping.
 * Concurrent calls are ignored while one is in flight.
 *
 * @param {(...args: unknown[]) => Promise<unknown>} write
 * @param {{ onSuccess?: Function, onError?: Function }} [handlers]
 */
export function useMutation(write, { onSuccess, onError } = {}) {
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  const run = useCallback(
    async (...args) => {
      if (inFlight.current) return undefined;

      inFlight.current = true;
      setPending(true);
      try {
        const result = await write(...args);
        onSuccess?.(result, ...args);
        return result;
      } catch (error) {
        onError?.(error);
        return undefined;
      } finally {
        inFlight.current = false;
        setPending(false);
      }
    },
    [write, onSuccess, onError],
  );

  return { run, pending };
}
