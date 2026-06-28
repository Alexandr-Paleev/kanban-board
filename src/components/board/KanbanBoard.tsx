import { useState, useMemo, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { Dialog } from '@/components/ui/Dialog'
import { TaskForm, type TaskFormValues } from '@/components/forms/TaskForm'
import { COLUMNS } from '@/lib/constants'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useMoveTask } from '@/hooks/useTasks'
import { useUIStore } from '@/store/ui'
import type { ColumnId, Task } from '@/types'

interface KanbanBoardProps {
  filters: {
    search: string
    priority: string
    assigneeId: string
    tagId: string
  }
}

export function KanbanBoard({ filters }: KanbanBoardProps) {
  const { data: tasks = [], isLoading, isError } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const moveTask = useMoveTask()

  const { editingTask, isCreateOpen, openEdit, closeEdit, openCreate, closeCreate } = useUIStore()
  const [createColumnId, setCreateColumnId] = useState<ColumnId>('todo')
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false
      if (filters.assigneeId !== 'all' && task.assigneeId !== filters.assigneeId) return false
      if (filters.tagId !== 'all' && !task.tagIds.includes(filters.tagId)) return false
      return true
    })
  }, [tasks, filters])

  const tasksByColumn = useMemo(() => {
    const map: Record<ColumnId, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    }
    for (const task of filteredTasks) {
      map[task.columnId].push(task)
    }
    return map
  }, [filteredTasks])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined
    if (task) setActiveTask(task)
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTask(null)
      const { active, over } = event
      if (!over || active.id === over.id) return

      const activeTask = tasks.find(t => t.id === active.id)
      if (!activeTask) return

      const overId = over.id as string
      const overIsColumn = COLUMNS.some(c => c.id === overId)

      if (overIsColumn) {
        const targetColumn = overId as ColumnId
        if (activeTask.columnId !== targetColumn) {
          moveTask.mutate({ id: activeTask.id, columnId: targetColumn, afterTaskId: null })
        }
        return
      }

      const overTask = tasks.find(t => t.id === overId)
      if (!overTask) return

      moveTask.mutate({
        id: activeTask.id,
        columnId: overTask.columnId,
        afterTaskId: overTask.id,
      })
    },
    [tasks, moveTask],
  )

  const handleAddTask = useCallback(
    (columnId: ColumnId) => {
      setCreateColumnId(columnId)
      openCreate()
    },
    [openCreate],
  )

  const handleCreate = useCallback(
    (values: TaskFormValues) => {
      createTask.mutate(
        {
          ...values,
          columnId: createColumnId,
          assigneeId: values.assigneeId,
        },
        { onSuccess: closeCreate },
      )
    },
    [createTask, createColumnId, closeCreate],
  )

  const handleUpdate = useCallback(
    (values: TaskFormValues) => {
      if (!editingTask) return
      updateTask.mutate(
        { id: editingTask.id, patch: values },
        { onSuccess: closeEdit },
      )
    },
    [editingTask, updateTask, closeEdit],
  )

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex gap-2 items-center text-slate-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading board…
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Failed to load tasks</p>
          <p className="text-sm text-slate-500 mt-1">Please refresh and try again</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4 pb-6 md:flex-row md:gap-5 md:overflow-x-auto">
          {COLUMNS.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByColumn[column.id]}
              onAddTask={handleAddTask}
              onEditTask={openEdit}
              onDeleteTask={deleteTask.mutate}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 opacity-90 shadow-xl">
              <TaskCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Dialog
        open={isCreateOpen}
        onOpenChange={open => !open && closeCreate()}
        title="New task"
        description="Add a task to the board"
      >
        <TaskForm
          defaultValues={{ columnId: createColumnId }}
          onSubmit={handleCreate}
          onCancel={closeCreate}
          isLoading={createTask.isPending}
        />
      </Dialog>

      <Dialog
        open={!!editingTask}
        onOpenChange={open => !open && closeEdit()}
        title="Edit task"
      >
        {editingTask && (
          <TaskForm
            defaultValues={{
              title: editingTask.title,
              description: editingTask.description,
              priority: editingTask.priority,
              columnId: editingTask.columnId,
              assigneeId: editingTask.assigneeId ?? 'unassigned',
              tagIds: editingTask.tagIds,
            }}
            onSubmit={handleUpdate}
            onCancel={closeEdit}
            isLoading={updateTask.isPending}
          />
        )}
      </Dialog>
    </>
  )
}
