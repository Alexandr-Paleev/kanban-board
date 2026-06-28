import { memo } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Column, ColumnId, Task } from '@/types'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onAddTask: (columnId: ColumnId) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

export const KanbanColumn = memo(
  function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: 'column', column } })

  return (
    <section
      aria-label={`${column.title} column`}
      className="flex w-full flex-col gap-3 md:w-72 md:shrink-0"
    >
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full', column.color)} />
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{column.title}</h2>
          <span data-testid="task-count" className="rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {tasks.length}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2 rounded-xl min-h-24 p-1 transition-colors',
          isOver && 'bg-indigo-50 dark:bg-indigo-950 ring-2 ring-indigo-200 dark:ring-indigo-800',
        )}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              isDraggingOver={isOver}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 py-8 text-xs text-slate-400 dark:text-slate-500">
            No tasks
          </div>
        )}
      </div>
    </section>
  )
  },
  (prev, next) =>
    prev.column === next.column &&
    prev.onAddTask === next.onAddTask &&
    prev.onEditTask === next.onEditTask &&
    prev.onDeleteTask === next.onDeleteTask &&
    prev.tasks.length === next.tasks.length &&
    prev.tasks.every((t, i) => t === next.tasks[i]),
)
