import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'icon'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500':
              variant === 'primary',
            'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400':
              variant === 'secondary',
            'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500':
              variant === 'destructive',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-9 px-4 text-sm': size === 'md',
            'h-9 w-9 p-0': size === 'icon',
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
