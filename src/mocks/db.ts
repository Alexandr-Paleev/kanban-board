import { generateId } from '@/lib/utils'
import type { Task } from '@/types'

const now = () => new Date().toISOString()

let tasks: Task[] = [
  {
    id: 'task-1',
    columnId: 'todo',
    title: 'Set up design system',
    description: 'Configure Tailwind, shadcn/ui tokens, and base components.',
    priority: 'high',
    assigneeId: 'u1',
    tagIds: ['t1', 't5'],
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-06-20T09:00:00Z',
  },
  {
    id: 'task-2',
    columnId: 'todo',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with OpenAPI spec.',
    priority: 'medium',
    assigneeId: 'u4',
    tagIds: ['t6'],
    createdAt: '2026-06-21T10:00:00Z',
    updatedAt: '2026-06-21T10:00:00Z',
  },
  {
    id: 'task-3',
    columnId: 'in_progress',
    title: 'Implement authentication flow',
    description: 'JWT login, refresh tokens, and protected routes.',
    priority: 'critical',
    assigneeId: 'u2',
    tagIds: ['t2', 't4'],
    createdAt: '2026-06-22T08:30:00Z',
    updatedAt: '2026-06-23T11:00:00Z',
  },
  {
    id: 'task-4',
    columnId: 'in_progress',
    title: 'Kanban drag-and-drop',
    description: 'Integrate @dnd-kit for card reordering and column moves.',
    priority: 'high',
    assigneeId: 'u1',
    tagIds: ['t1', 't4'],
    createdAt: '2026-06-22T14:00:00Z',
    updatedAt: '2026-06-24T09:00:00Z',
  },
  {
    id: 'task-5',
    columnId: 'review',
    title: 'Fix date picker timezone bug',
    description: 'Dates shift by one day in UTC-5 and below.',
    priority: 'critical',
    assigneeId: 'u3',
    tagIds: ['t3', 't1'],
    createdAt: '2026-06-23T16:00:00Z',
    updatedAt: '2026-06-25T10:30:00Z',
  },
  {
    id: 'task-6',
    columnId: 'review',
    title: 'Add dark mode support',
    description: 'Implement theme toggle persisted to localStorage.',
    priority: 'medium',
    assigneeId: 'u1',
    tagIds: ['t1', 't5'],
    createdAt: '2026-06-24T09:00:00Z',
    updatedAt: '2026-06-26T08:00:00Z',
  },
  {
    id: 'task-7',
    columnId: 'done',
    title: 'Project scaffolding',
    description: 'Vite + React + TypeScript + ESLint setup.',
    priority: 'low',
    assigneeId: 'u2',
    tagIds: ['t2', 't4'],
    createdAt: '2026-06-18T08:00:00Z',
    updatedAt: '2026-06-19T17:00:00Z',
  },
  {
    id: 'task-8',
    columnId: 'done',
    title: 'CI pipeline',
    description: 'GitHub Actions: lint, type-check, and test on every PR.',
    priority: 'medium',
    assigneeId: 'u4',
    tagIds: ['t4'],
    createdAt: '2026-06-19T10:00:00Z',
    updatedAt: '2026-06-20T12:00:00Z',
  },
]

export const db = {
  tasks: {
    getAll: (): Task[] => [...tasks],

    getById: (id: string): Task | undefined => tasks.find(t => t.id === id),

    create: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
      const task: Task = { ...data, id: generateId(), createdAt: now(), updatedAt: now() }
      tasks = [...tasks, task]
      return task
    },

    update: (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>): Task => {
      tasks = tasks.map(t => (t.id === id ? { ...t, ...patch, updatedAt: now() } : t))
      return tasks.find(t => t.id === id)!
    },

    delete: (id: string): void => {
      tasks = tasks.filter(t => t.id !== id)
    },

    reorder: (taskId: string, targetColumnId: Task['columnId'], afterTaskId: string | null): Task => {
      const task = tasks.find(t => t.id === taskId)!
      const updated = { ...task, columnId: targetColumnId, updatedAt: now() }
      tasks = tasks.filter(t => t.id !== taskId)

      if (afterTaskId === null) {
        const columnTasks = tasks.filter(t => t.columnId === targetColumnId)
        const firstIdx = tasks.indexOf(columnTasks[0])
        if (firstIdx === -1) {
          tasks = [...tasks, updated]
        } else {
          tasks = [...tasks.slice(0, firstIdx), updated, ...tasks.slice(firstIdx)]
        }
      } else {
        const afterIdx = tasks.findIndex(t => t.id === afterTaskId)
        tasks = [...tasks.slice(0, afterIdx + 1), updated, ...tasks.slice(afterIdx + 1)]
      }

      return updated
    },
  },
}
