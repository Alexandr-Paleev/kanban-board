import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { useTasks, useCreateTask, useDeleteTask, useUpdateTask, useMoveTask } from '@/hooks/useTasks'
import { api } from '@/lib/api'
import type { Task } from '@/types'

vi.mock('@/lib/api', () => ({
  api: {
    tasks: {
      list: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      move: vi.fn(),
    },
  },
}))

const TASK: Task = {
  id: 'task-1',
  columnId: 'todo',
  title: 'Test task',
  description: '',
  priority: 'medium',
  assigneeId: null,
  tagIds: [],
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
}

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return {
    qc,
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    ),
  }
}

beforeEach(() => vi.resetAllMocks())

describe('useTasks', () => {
  it('fetches task list from api and returns it', async () => {
    vi.mocked(api.tasks.list).mockResolvedValue([TASK])
    const { qc, wrapper } = makeWrapper()
    const { result } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([TASK])
    expect(vi.mocked(api.tasks.list)).toHaveBeenCalledOnce()
    qc.clear()
  })
})

describe('useCreateTask', () => {
  it('calls api.tasks.create and appends the new task to the cache', async () => {
    const created: Task = { ...TASK, id: 'task-2', title: 'New task' }
    vi.mocked(api.tasks.list).mockResolvedValue([TASK])
    vi.mocked(api.tasks.create).mockResolvedValue(created)

    const { qc, wrapper } = makeWrapper()
    const { result: tasks } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(tasks.current.isSuccess).toBe(true))

    const { result: create } = renderHook(() => useCreateTask(), { wrapper })
    await act(async () => {
      create.current.mutate({
        title: 'New task',
        description: '',
        priority: 'medium',
        columnId: 'todo',
        assigneeId: null,
        tagIds: [],
      })
    })
    await waitFor(() => expect(create.current.isSuccess).toBe(true))

    const cached = qc.getQueryData<Task[]>(['tasks'])
    expect(cached).toEqual(expect.arrayContaining([TASK, created]))
    qc.clear()
  })
})

describe('useDeleteTask', () => {
  it('optimistically removes the task from cache before the request resolves', async () => {
    let resolveDelete!: () => void
    vi.mocked(api.tasks.list).mockResolvedValue([TASK])
    vi.mocked(api.tasks.delete).mockReturnValue(new Promise<void>(res => { resolveDelete = res }))

    const { qc, wrapper } = makeWrapper()
    const { result: tasks } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(tasks.current.isSuccess).toBe(true))

    const { result: del } = renderHook(() => useDeleteTask(), { wrapper })
    act(() => { del.current.mutate(TASK.id) })

    await waitFor(() => expect(qc.getQueryData<Task[]>(['tasks'])).toHaveLength(0))
    resolveDelete()
    qc.clear()
  })

  it('rolls back the cache when delete fails', async () => {
    vi.mocked(api.tasks.list).mockResolvedValue([TASK])
    vi.mocked(api.tasks.delete).mockRejectedValue(new Error('Server error'))

    const { qc, wrapper } = makeWrapper()
    const { result: tasks } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(tasks.current.isSuccess).toBe(true))

    const { result: del } = renderHook(() => useDeleteTask(), { wrapper })
    await act(async () => { del.current.mutate(TASK.id) })
    await waitFor(() => expect(del.current.isError).toBe(true))

    expect(qc.getQueryData<Task[]>(['tasks'])).toEqual([TASK])
    qc.clear()
  })
})

describe('useUpdateTask', () => {
  it('patches the updated task in cache on success', async () => {
    const updated: Task = { ...TASK, title: 'Updated title', priority: 'high' }
    vi.mocked(api.tasks.list).mockResolvedValue([TASK])
    vi.mocked(api.tasks.update).mockResolvedValue(updated)

    const { qc, wrapper } = makeWrapper()
    const { result: tasks } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(tasks.current.isSuccess).toBe(true))

    const { result: update } = renderHook(() => useUpdateTask(), { wrapper })
    await act(async () => {
      update.current.mutate({ id: TASK.id, patch: { title: 'Updated title', priority: 'high' } })
    })
    await waitFor(() => expect(update.current.isSuccess).toBe(true))

    const cached = qc.getQueryData<Task[]>(['tasks'])
    expect(cached).toEqual([updated])
    qc.clear()
  })
})

describe('useMoveTask', () => {
  it('optimistically patches columnId before the request resolves', async () => {
    let resolveMove!: (t: Task) => void
    vi.mocked(api.tasks.list).mockResolvedValue([TASK])
    vi.mocked(api.tasks.move).mockReturnValue(
      new Promise<Task>(res => { resolveMove = res }),
    )

    const { qc, wrapper } = makeWrapper()
    const { result: tasks } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(tasks.current.isSuccess).toBe(true))

    const { result: move } = renderHook(() => useMoveTask(), { wrapper })
    act(() => {
      move.current.mutate({ id: TASK.id, columnId: 'done', afterTaskId: null })
    })

    await waitFor(() => {
      const cached = qc.getQueryData<Task[]>(['tasks'])
      return cached?.[0]?.columnId === 'done'
    })

    resolveMove({ ...TASK, columnId: 'done' })
    qc.clear()
  })

  it('rolls back columnId when move fails', async () => {
    vi.mocked(api.tasks.list).mockResolvedValue([TASK])
    vi.mocked(api.tasks.move).mockRejectedValue(new Error('Network error'))

    const { qc, wrapper } = makeWrapper()
    const { result: tasks } = renderHook(() => useTasks(), { wrapper })
    await waitFor(() => expect(tasks.current.isSuccess).toBe(true))

    const { result: move } = renderHook(() => useMoveTask(), { wrapper })
    await act(async () => {
      move.current.mutate({ id: TASK.id, columnId: 'done', afterTaskId: null })
    })
    await waitFor(() => expect(move.current.isError).toBe(true))

    expect(qc.getQueryData<Task[]>(['tasks'])).toEqual([TASK])
    qc.clear()
  })
})
