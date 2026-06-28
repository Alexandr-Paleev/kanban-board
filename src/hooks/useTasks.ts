import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Task } from '@/types'

export const TASKS_KEY = ['tasks'] as const

export function useTasks() {
  return useQuery({ queryKey: TASKS_KEY, queryFn: api.tasks.list })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.tasks.create,
    onSuccess: (task) => {
      qc.setQueryData<Task[]>(TASKS_KEY, (prev = []) => [...prev, task])
    },
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Omit<Task, 'id' | 'createdAt'>> }) =>
      api.tasks.update(id, patch),
    onSuccess: (updated) => {
      qc.setQueryData<Task[]>(TASKS_KEY, (prev = []) =>
        prev.map(t => (t.id === updated.id ? updated : t)),
      )
    },
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.tasks.delete,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY })
      const previous = qc.getQueryData<Task[]>(TASKS_KEY)
      qc.setQueryData<Task[]>(TASKS_KEY, (prev = []) => prev.filter(t => t.id !== id))
      return { previous }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) qc.setQueryData(TASKS_KEY, ctx.previous)
    },
  })
}

export function useMoveTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      columnId,
      afterTaskId,
    }: {
      id: string
      columnId: Task['columnId']
      afterTaskId: string | null
    }) => api.tasks.move(id, columnId, afterTaskId),
    onMutate: async ({ id, columnId }) => {
      await qc.cancelQueries({ queryKey: TASKS_KEY })
      const previous = qc.getQueryData<Task[]>(TASKS_KEY)
      qc.setQueryData<Task[]>(TASKS_KEY, (prev = []) =>
        prev.map(t => (t.id === id ? { ...t, columnId } : t)),
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(TASKS_KEY, ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: TASKS_KEY }),
  })
}
