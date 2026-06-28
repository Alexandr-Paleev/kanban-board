import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { TaskCard } from './TaskCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import type { Column, Task } from '@/types'

interface KanbanColumnProps {
  column: Column
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
}

export function KanbanColumn({ column, tasks, onAddTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id, data: { type: 'column', column } })

  return (
    <section
      aria-label={`${column.title} column`}
      className="flex w-72 shrink-0 flex-col gap-3"
    >
      <header className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={cn('h-2.5 w-2.5 rounded-full', column.color)} />
          <h2 className="text-sm font-semibold text-slate-700">{column.title}</h2>
          <span data-testid="task-count" className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {tasks.length}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={onAddTask}
          aria-label={`Add task to ${column.title}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </header>

      <div
        ref={setNodeRef}
        className={cn(
          'flex flex-col gap-2 rounded-xl min-h-24 p-1 transition-colors',
          isOver && 'bg-indigo-50 ring-2 ring-indigo-200',
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
          <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 py-8 text-xs text-slate-400">
            No tasks
          </div>
        )}
      </div>
    </section>
  )
}
