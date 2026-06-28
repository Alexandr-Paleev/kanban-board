import { create } from 'zustand'
import type { KanbanFilters, Task } from '@/types'

interface UIState {
  filters: KanbanFilters
  editingTask: Task | null
  isCreateOpen: boolean

  setFilter: <K extends keyof KanbanFilters>(key: K, value: KanbanFilters[K]) => void
  resetFilters: () => void
  openEdit: (task: Task) => void
  closeEdit: () => void
  openCreate: () => void
  closeCreate: () => void
}

const DEFAULT_FILTERS: KanbanFilters = {
  search: '',
  priority: 'all',
  assigneeId: 'all',
  tagId: 'all',
}

export const useUIStore = create<UIState>((set) => ({
  filters: DEFAULT_FILTERS,
  editingTask: null,
  isCreateOpen: false,

  setFilter: (key, value) =>
    set(s => ({ filters: { ...s.filters, [key]: value } })),

  resetFilters: () => set({ filters: DEFAULT_FILTERS }),

  openEdit: (task) => set({ editingTask: task }),
  closeEdit: () => set({ editingTask: null }),

  openCreate: () => set({ isCreateOpen: true }),
  closeCreate: () => set({ isCreateOpen: false }),
}))
