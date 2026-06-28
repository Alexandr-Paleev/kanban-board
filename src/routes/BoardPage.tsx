import { KanbanBoard } from '@/components/board/KanbanBoard'
import { FilterBar } from '@/components/board/FilterBar'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useUIStore } from '@/store/ui'

export default function BoardPage() {
  const { filters } = useUIStore()

  return (
    <main className="mx-auto max-w-screen-2xl px-6 py-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Board</h1>
        <p className="text-sm text-slate-500 mt-0.5">Drag cards to update status</p>
      </div>

      <div className="mb-5">
        <FilterBar />
      </div>

      <ErrorBoundary>
        <KanbanBoard filters={filters} />
      </ErrorBoundary>
    </main>
  )
}
