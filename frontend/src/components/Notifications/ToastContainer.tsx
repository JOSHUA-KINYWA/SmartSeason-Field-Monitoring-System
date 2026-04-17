import { useToast } from '../../context/ToastContext';

const toastStyles: Record<string, string> = {
  success: 'border-emerald-400/20 bg-emerald-950/90 text-emerald-100',
  info: 'border-sky-400/20 bg-sky-950/90 text-sky-100',
  warning: 'border-amber-400/20 bg-amber-950/90 text-amber-100',
  error: 'border-rose-400/20 bg-rose-950/90 text-rose-100',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3 px-4 sm:px-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto overflow-hidden rounded-3xl border px-4 py-4 shadow-2xl shadow-black/20 transition-all duration-200 animate-fade-in-up ${toastStyles[toast.type]}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-sm leading-5 text-current/80">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-sm font-semibold opacity-70 transition hover:opacity-100"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
