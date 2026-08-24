import { useToast } from '@/shared/context/ToastProvider';

export default function ToastStack() {
  const { toasts } = useToast();

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.tone}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
