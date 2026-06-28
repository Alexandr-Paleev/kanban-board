import type { Column, Priority, Tag, User } from '@/types'

export const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-400' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'Review', color: 'bg-amber-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
]

export const PRIORITY_META: Record<Priority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-600 border-slate-300' },
  medium: { label: 'Medium', color: 'bg-blue-50 text-blue-700 border-blue-300' },
  high: { label: 'High', color: 'bg-orange-50 text-orange-700 border-orange-300' },
  critical: { label: 'Critical', color: 'bg-red-50 text-red-700 border-red-300' },
}

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Chen', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Alice' },
  { id: 'u2', name: 'Bob Smith', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Bob' },
  { id: 'u3', name: 'Carol White', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Carol' },
  { id: 'u4', name: 'Dave Kim', avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=Dave' },
]

export const MOCK_TAGS: Tag[] = [
  { id: 't1', label: 'Frontend', color: 'bg-violet-100 text-violet-700' },
  { id: 't2', label: 'Backend', color: 'bg-sky-100 text-sky-700' },
  { id: 't3', label: 'Bug', color: 'bg-red-100 text-red-700' },
  { id: 't4', label: 'Feature', color: 'bg-green-100 text-green-700' },
  { id: 't5', label: 'Design', color: 'bg-pink-100 text-pink-700' },
  { id: 't6', label: 'Docs', color: 'bg-yellow-100 text-yellow-700' },
]
