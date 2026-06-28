import { useEffect, useState } from 'react'
import { Plus, Kanban, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/ui'
import { useThemeStore } from '@/store/theme'
import { useLiveSync } from '@/hooks/useLiveSync'

function LiveBadge({ lastSync }: { lastSync: Date }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    setElapsed(0)
    const id = setInterval(() => {
      setElapsed(s => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [lastSync])

  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span className="hidden sm:inline">Live · {elapsed}s ago</span>
    </div>
  )
}

export function Header() {
  const { openCreate } = useUIStore()
  const { theme, toggle } = useThemeStore()
  const lastSync = useLiveSync()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Kanban className="h-5 w-5 text-indigo-600" />
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">Kanban</span>
          </div>
          <LiveBadge lastSync={lastSync} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-lg p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark'
              ? <Sun className="h-4 w-4" />
              : <Moon className="h-4 w-4" />
            }
          </button>
          <Button onClick={openCreate} size="sm">
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>
      </div>
    </header>
  )
}
