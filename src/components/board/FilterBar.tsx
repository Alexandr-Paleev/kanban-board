import { Search, RotateCcw } from 'lucide-react'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { MOCK_USERS, MOCK_TAGS } from '@/lib/constants'
import { useUIStore } from '@/store/ui'

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All priorities' },
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const ASSIGNEE_OPTIONS = [
  { value: 'all', label: 'All members' },
  ...MOCK_USERS.map(u => ({ value: u.id, label: u.name })),
]

const TAG_OPTIONS = [
  { value: 'all', label: 'All tags' },
  ...MOCK_TAGS.map(t => ({ value: t.id, label: t.label })),
]

export function FilterBar() {
  const { filters, setFilter, resetFilters } = useUIStore()

  const hasActiveFilters =
    filters.search !== '' ||
    filters.priority !== 'all' ||
    filters.assigneeId !== 'all' ||
    filters.tagId !== 'all'

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search tasks…"
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          aria-label="Search tasks"
          className="h-9 w-52 rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 transition-colors"
        />
      </div>

      <Select
        value={filters.priority}
        onValueChange={v => setFilter('priority', v as typeof filters.priority)}
        options={PRIORITY_OPTIONS}
        className="w-40"
      />

      <Select
        value={filters.assigneeId}
        onValueChange={v => setFilter('assigneeId', v)}
        options={ASSIGNEE_OPTIONS}
        className="w-40"
      />

      <Select
        value={filters.tagId}
        onValueChange={v => setFilter('tagId', v)}
        options={TAG_OPTIONS}
        className="w-36"
      />

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters} aria-label="Reset filters">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  )
}

