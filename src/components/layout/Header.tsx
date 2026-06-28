import { useEffect, useState } from 'react'
import { Plus, Kanban } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/ui'
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
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
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
  const lastSync = useLiveSync()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Kanban className="h-5 w-5 text-indigo-600" />
            <span className="text-base font-bold tracking-tight text-slate-900">Kanban</span>
          </div>
          <LiveBadge lastSync={lastSync} />
        </div>

        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" />
          New task
        </Button>
      </div>
    </header>
  )
}
