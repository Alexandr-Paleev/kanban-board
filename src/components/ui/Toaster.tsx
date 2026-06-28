import { useEffect } from 'react'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { useToastStore, type Toast } from '@/store/toast'
import { cn } from '@/lib/utils'

const DURATION_MS = 3500

function ToastItem({ toast }: { toast: Toast }) {
  const remove = useToastStore(s => s.remove)

  useEffect(() => {
    const id = setTimeout(() => remove(toast.id), DURATION_MS)
    return () => clearTimeout(id)
  }, [toast.id, remove])

  return (
    <div
      className={cn(
        'toast-in flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm min-w-72 bg-white dark:bg-slate-800',
        toast.type === 'success'
          ? 'border-slate-200 dark:border-slate-600'
          : 'border-red-200 dark:border-red-800',
      )}
    >
      {toast.type === 'success'
        ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
        : <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
      }
      <span className="flex-1 text-slate-800 dark:text-slate-100">{toast.message}</span>
      <button
        onClick={() => remove(toast.id)}
        className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useToastStore(s => s.toasts)

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
