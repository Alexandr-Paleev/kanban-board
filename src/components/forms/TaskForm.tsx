import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { MOCK_USERS, MOCK_TAGS, PRIORITY_META } from '@/lib/constants'
import type { Priority, ColumnId } from '@/types'
import { cn } from '@/lib/utils'

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Max 100 characters'),
  description: z.string().max(500, 'Max 500 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical'] as const),
  columnId: z.enum(['todo', 'in_progress', 'review', 'done'] as const),
  assigneeId: z.string().nullable(),
  tagIds: z.array(z.string()),
})

export type TaskFormValues = z.infer<typeof schema>

interface TaskFormProps {
  defaultValues?: Partial<TaskFormValues>
  onSubmit: (values: TaskFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

const PRIORITY_OPTIONS = (['low', 'medium', 'high', 'critical'] as Priority[]).map(p => ({
  value: p,
  label: PRIORITY_META[p].label,
}))

const COLUMN_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
]

const ASSIGNEE_OPTIONS = [
  { value: 'unassigned', label: 'Unassigned' },
  ...MOCK_USERS.map(u => ({ value: u.id, label: u.name })),
]

export function TaskForm({ defaultValues, onSubmit, onCancel, isLoading }: TaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      columnId: 'todo',
      assigneeId: null,
      tagIds: [],
      ...defaultValues,
    },
  })

  const selectedTagIds = watch('tagIds')

  const toggleTag = (id: string) => {
    const current = selectedTagIds
    setValue(
      'tagIds',
      current.includes(id) ? current.filter(t => t !== id) : [...current, id],
    )
  }

  const handleFormSubmit = (values: TaskFormValues) => {
    onSubmit({
      ...values,
      assigneeId: values.assigneeId === 'unassigned' ? null : values.assigneeId,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Title <span className="text-red-500">*</span>
        </label>
        <Input
          id="title"
          placeholder="What needs to be done?"
          error={errors.title?.message}
          {...register('title')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Description
        </label>
        <Textarea
          id="description"
          placeholder="Add more details…"
          error={errors.description?.message}
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Priority</label>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                options={PRIORITY_OPTIONS}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700">Status</label>
          <Controller
            name="columnId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={v => field.onChange(v as ColumnId)}
                options={COLUMN_OPTIONS}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Assignee</label>
        <Controller
          name="assigneeId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? 'unassigned'}
              onValueChange={field.onChange}
              options={ASSIGNEE_OPTIONS}
              placeholder="Unassigned"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-700">Tags</label>
        <div className="flex flex-wrap gap-2">
          {MOCK_TAGS.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-medium border transition-all',
                selectedTagIds.includes(tag.id)
                  ? `${tag.color} border-current ring-2 ring-offset-1 ring-current/30`
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300',
              )}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save task'}
        </Button>
      </div>
    </form>
  )
}
