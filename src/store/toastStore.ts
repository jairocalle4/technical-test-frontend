import { create } from 'zustand'

export type ToastTone = 'success' | 'warning' | 'error'

export type Toast = {
  id: string
  tone: ToastTone
  message: string
}

type ToastState = {
  toasts: Toast[]
  push: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

/** UI-only state (notifications). Server data lives in TanStack Query, never here. */
export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({ toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }] })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}))
