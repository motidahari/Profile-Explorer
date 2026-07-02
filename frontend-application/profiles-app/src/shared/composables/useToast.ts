import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ShowOptions {
  type?: ToastType
  duration?: number
}

const DEFAULT_DURATION = 3500

const toasts = reactive<Toast[]>([])

let _idCounter = 0

function generateId(): string {
  _idCounter += 1
  return `toast-${_idCounter}`
}

function dismiss(id: string): void {
  const index = toasts.findIndex((t) => t.id === id)
  if (index !== -1) {
    toasts.splice(index, 1)
  }
}

function show(message: string, options: ShowOptions = {}): string {
  const id = generateId()
  const type = options.type ?? 'info'
  const duration = options.duration ?? DEFAULT_DURATION

  toasts.push({ id, message, type })

  setTimeout(() => dismiss(id), duration)

  return id
}

function success(message: string, duration?: number): string {
  return show(message, { type: 'success', duration })
}

function error(message: string, duration?: number): string {
  return show(message, { type: 'error', duration })
}

function info(message: string, duration?: number): string {
  return show(message, { type: 'info', duration })
}

function clear(): void {
  toasts.splice(0, toasts.length)
}

export function useToast() {
  return { toasts, show, success, error, info, dismiss, clear }
}
