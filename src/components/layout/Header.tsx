import { Plus, Kanban } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useUIStore } from '@/store/ui'

export function Header() {
  const { openCreate } = useUIStore()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <Kanban className="h-5 w-5 text-indigo-600" />
          <span className="text-base font-bold tracking-tight text-slate-900">Kanban</span>
        </div>

        <Button onClick={openCreate} size="sm">
          <Plus className="h-4 w-4" />
          New task
        </Button>
      </div>
    </header>
  )
}
