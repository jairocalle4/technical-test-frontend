import { useEffect } from 'react'
import { useToastStore, type Toast, type ToastTone } from '../../store/toastStore.ts'
import { cn } from './cn.ts'

const TOAST_DURATION_MS = 5000

const toneClasses: Record<ToastTone, string> = {
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-300 bg-amber-50 text-amber-900',
  error: 'border-rose-300 bg-rose-50 text-rose-900',
}

const toneLabels: Record<ToastTone, string> = {
  success: 'Listo',
  warning: 'Aviso',
  error: 'Error',
}

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useToastStore((state) => state.dismiss)

  useEffect(() => {
    const timer = setTimeout(() => dismiss(toast.id), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [dismiss, toast.id])

  return (
    <div
      role={toast.tone === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-lg',
        toneClasses[toast.tone],
      )}
    >
      <p className="flex-1">
        <span className="font-semibold">{toneLabels[toast.tone]}: </span>
        {toast.message}
      </p>
      <button
        type="button"
        aria-label="Cerrar notificación"
        onClick={() => dismiss(toast.id)}
        className="rounded px-1 leading-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
      >
        ×
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
