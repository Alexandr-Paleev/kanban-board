import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  error?: string
}

export function Select({ value, onValueChange, options, placeholder, className, error }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger
          className={cn(
            'flex h-9 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 data-[placeholder]:text-slate-400',
            error && 'border-red-400',
            className,
          )}
        >
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content className="z-50 min-w-[8rem] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95">
            <RadixSelect.Viewport className="p-1">
              {options.map(opt => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 pl-8 text-sm text-slate-700 outline-none hover:bg-indigo-50 hover:text-indigo-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <RadixSelect.ItemIndicator className="absolute left-2 flex items-center">
                    <Check className="h-3.5 w-3.5" />
                  </RadixSelect.ItemIndicator>
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
