import { useCallback, useEffect, useRef, useState } from 'react';

const INITIAL = { data: null, loading: true, error: null };

/**
 * Runs a read on mount and whenever `deps` change.
 *
 * Late responses from superseded runs are discarded, and nothing is written
 * to state after unmount.
 *
 * @param {() => Promise<unknown>} read
 * @param {unknown[]} deps
 */
export function useApi(read, deps = []) {
  const [state, setState] = useState(INITIAL);
  const latestRun = useRef(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(() => {
    const runId = (latestRun.current += 1);
    const isCurrent = () => mounted.current && runId === latestRun.current;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    Promise.resolve()
      .then(read)
      .then((data) => isCurrent() && setState({ data, loading: false, error: null }))
      .catch((error) => isCurrent() && setState({ data: null, loading: false, error }));
    // `read` is recreated every render by design; `deps` is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(load, [load]);

  const setData = useCallback((update) => {
    setState((previous) => ({
      ...previous,
      data: typeof update === 'function' ? update(previous.data) : update,
    }));
  }, []);

  return { ...state, reload: load, setData };
}
