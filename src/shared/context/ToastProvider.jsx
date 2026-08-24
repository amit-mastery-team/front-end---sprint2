import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { TOAST_DURATION_MS, TOAST_TONE } from '@/shared/constants/ui';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message, tone = TOAST_TONE.NEUTRAL) => {
      const id = (nextId.current += 1);
      setToasts((current) => [...current, { id, message, tone }]);
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      toasts,
      dismiss,
      notify: show,
      notifySuccess: (message) => show(message, TOAST_TONE.OK),
      notifyFailure: (message) => show(message, TOAST_TONE.BAD),
    }),
    [toasts, dismiss, show],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

ToastProvider.propTypes = {
  children: PropTypes.node,
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
