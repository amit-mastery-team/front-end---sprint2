import { useEffect, useRef, useState } from 'react';
import { TIMER_WARNING_SECONDS } from '@/shared/constants/ui';

const SECOND_MS = 1000;
const pad = (value) => String(value).padStart(2, '0');

const format = (totalSeconds) =>
  `${pad(Math.floor(totalSeconds / 60))}:${pad(totalSeconds % 60)}`;

/**
 * Ticks down for display only — the server stays the timing authority and the
 * value resets whenever a fresh `seconds` arrives from an API response.
 *
 * @param {number} [seconds]
 * @param {{ running?: boolean, onExpire?: () => void }} [options]
 */
export function useCountdown(seconds, { running = true, onExpire } = {}) {
  const [remaining, setRemaining] = useState(seconds ?? 0);
  const hasExpired = useRef(false);

  useEffect(() => {
    setRemaining(seconds ?? 0);
    hasExpired.current = false;
  }, [seconds]);

  useEffect(() => {
    if (!running) return undefined;

    const tick = setInterval(() => {
      setRemaining((current) => {
        if (current > 1) return current - 1;
        if (!hasExpired.current) {
          hasExpired.current = true;
          onExpire?.();
        }
        return 0;
      });
    }, SECOND_MS);

    return () => clearInterval(tick);
  }, [running, onExpire]);

  return {
    seconds: remaining,
    label: format(remaining),
    isLow: remaining > 0 && remaining <= TIMER_WARNING_SECONDS,
    isExpired: remaining === 0,
  };
}
