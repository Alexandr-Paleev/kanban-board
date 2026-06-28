import { delay, http, HttpResponse } from 'msw'
import { db } from './db'
import type { Task } from '@/types'

const BASE = '/api'
const LAG = 300

export const handlers = [
  http.get(`${BASE}/tasks`, async () => {
    await delay(LAG)
    return HttpResponse.json(db.tasks.getAll())
  }),

  http.post(`${BASE}/tasks`, async ({ request }) => {
    await delay(LAG)
    const body = (await request.json()) as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
    const task = db.tasks.create(body)
    return HttpResponse.json(task, { status: 201 })
  }),

  http.patch(`${BASE}/tasks/:id`, async ({ params, request }) => {
    await delay(LAG)
    const patch = (await request.json()) as Partial<Task>
    const task = db.tasks.update(params.id as string, patch)
    return HttpResponse.json(task)
  }),

  http.delete(`${BASE}/tasks/:id`, async ({ params }) => {
    await delay(LAG)
    db.tasks.delete(params.id as string)
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${BASE}/tasks/:id/move`, async ({ params, request }) => {
    await delay(LAG)
    const { columnId, afterTaskId } = (await request.json()) as {
      columnId: Task['columnId']
      afterTaskId: string | null
    }
    const task = db.tasks.reorder(params.id as string, columnId, afterTaskId)
    return HttpResponse.json(task)
  }),
]
