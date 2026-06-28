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
        'toast-in flex items-start gap-3 rounded-lg border px-4 py-3 shadow-lg text-sm min-w-72 bg-white',
        toast.type === 'success' ? 'border-slate-200' : 'border-red-200',
      )}
      role="status"
      aria-live="polite"
    >
      {toast.type === 'success'
        ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
        : <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
      }
      <span className="flex-1 text-slate-800">{toast.message}</span>
      <button
        onClick={() => remove(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useToastStore(s => s.toasts)

  if (toasts.length === 0) return null

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}
