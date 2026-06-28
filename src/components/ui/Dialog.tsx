import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function Dialog({ open, onOpenChange, title, description, children, className }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in-0" />
        <RadixDialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-xl bg-white shadow-2xl animate-in fade-in-0 zoom-in-95 focus:outline-none',
            className,
          )}
          aria-describedby={description ? 'dialog-desc' : undefined}
        >
          <div className="flex items-start justify-between p-5 border-b border-slate-100">
            <div>
              <RadixDialog.Title className="text-base font-semibold text-slate-900">
                {title}
              </RadixDialog.Title>
              {description && (
                <RadixDialog.Description id="dialog-desc" className="text-sm text-slate-500 mt-0.5">
                  {description}
                </RadixDialog.Description>
              )}
            </div>
            <RadixDialog.Close className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </RadixDialog.Close>
          </div>
          <div className="p-5">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
