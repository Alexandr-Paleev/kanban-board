import type { Task } from '@/types'

async function request<T>(url: string, init?: RequestInit, attempt = 0): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...init,
  })
  // 304 means MSW service worker isn't active yet (dev-only race on startup).
  // Retry once after a short delay so the worker can finish activating.
  if (res.status === 304 && attempt === 0) {
    await new Promise(r => setTimeout(r, 300))
    return request<T>(url, init, 1)
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  tasks: {
    list: () => request<Task[]>('/api/tasks'),

    create: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) =>
      request<Task>('/api/tasks', { method: 'POST', body: JSON.stringify(data) }),

    update: (id: string, patch: Partial<Omit<Task, 'id' | 'createdAt'>>) =>
      request<Task>(`/api/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),

    delete: (id: string) =>
      request<void>(`/api/tasks/${id}`, { method: 'DELETE' }),

    move: (id: string, columnId: Task['columnId'], afterTaskId: string | null) =>
      request<Task>(`/api/tasks/${id}/move`, {
        method: 'POST',
        body: JSON.stringify({ columnId, afterTaskId }),
      }),
  },
}
