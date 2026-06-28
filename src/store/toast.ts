import { create } from 'zustand'
import { generateId } from '@/lib/utils'

export type ToastType = 'success' | 'error'

export interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastStore {
  toasts: Toast[]
  add: (message: string, type?: ToastType) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type = 'success') =>
    set(s => ({ toasts: [...s.toasts, { id: generateId(), type, message }] })),
  remove: (id) =>
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
