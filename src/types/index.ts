export type Priority = 'low' | 'medium' | 'high' | 'critical'

export type ColumnId = 'todo' | 'in_progress' | 'review' | 'done'

export interface User {
  id: string
  name: string
  avatarUrl: string
}

export interface Tag {
  id: string
  label: string
  color: string
}

export interface Task {
  id: string
  columnId: ColumnId
  title: string
  description: string
  priority: Priority
  assigneeId: string | null
  tagIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Column {
  id: ColumnId
  title: string
  color: string
}

export interface KanbanFilters {
  search: string
  priority: Priority | 'all'
  assigneeId: string | 'all'
  tagId: string | 'all'
}
