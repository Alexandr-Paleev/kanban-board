import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { PRIORITY_META, MOCK_USERS, MOCK_TAGS } from '@/lib/constants'
import { formatDate, cn } from '@/lib/utils'
import type { Task } from '@/types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  isDraggingOver?: boolean
}

export function TaskCard({ task, onEdit, onDelete, isDraggingOver }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const assignee = MOCK_USERS.find(u => u.id === task.assigneeId)
  const tags = MOCK_TAGS.filter(t => task.tagIds.includes(t.id))
  const priority = PRIORITY_META[task.priority]

  return (
    <article
      ref={setNodeRef}
      style={style}
      aria-label={`Task: ${task.title}`}
      className={cn(
        'group relative rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all',
        isDragging && 'opacity-40 ring-2 ring-indigo-400',
        isDraggingOver && 'ring-2 ring-indigo-300',
        !isDragging && 'hover:shadow-md hover:border-slate-300',
      )}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 cursor-grab touch-none text-slate-300 hover:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">
            {task.title}
          </p>

          {task.description && (
            <p className="mt-1 text-xs text-slate-500 line-clamp-2">{task.description}</p>
          )}

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {tags.map(tag => (
                <span
                  key={tag.id}
                  className={cn('rounded-full px-2 py-0.5 text-xs font-medium', tag.color)}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          <div className="mt-2.5 flex items-center justify-between gap-2">
            <Badge className={priority.color}>{priority.label}</Badge>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-slate-400">{formatDate(task.updatedAt)}</span>
              {assignee && <Avatar src={assignee.avatarUrl} alt={assignee.name} />}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-2 top-2 hidden group-hover:flex gap-0.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </article>
  )
}
