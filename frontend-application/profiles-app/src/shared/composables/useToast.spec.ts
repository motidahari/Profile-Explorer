import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useToast } from './useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const { clear } = useToast()
    clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    const { clear } = useToast()
    clear()
  })

  it('adds a toast via show()', () => {
    const { toasts, show } = useToast()
    show('Hello', { type: 'info', duration: 5000 })
    expect(toasts).toHaveLength(1)
    expect(toasts[0].message).toBe('Hello')
    expect(toasts[0].type).toBe('info')
  })

  it('adds a success toast', () => {
    const { toasts, success } = useToast()
    success('Saved!')
    expect(toasts[0].type).toBe('success')
  })

  it('adds an error toast', () => {
    const { toasts, error } = useToast()
    error('Oops')
    expect(toasts[0].type).toBe('error')
  })

  it('adds an info toast', () => {
    const { toasts, info } = useToast()
    info('Note')
    expect(toasts[0].type).toBe('info')
  })

  it('dismiss removes the toast by id', () => {
    const { toasts, show, dismiss } = useToast()
    const id = show('Test', { type: 'info', duration: 9999 })
    expect(toasts).toHaveLength(1)
    dismiss(id)
    expect(toasts).toHaveLength(0)
  })

  it('auto-dismisses after duration', () => {
    const { toasts, show } = useToast()
    show('Temp', { type: 'info', duration: 1000 })
    expect(toasts).toHaveLength(1)
    vi.advanceTimersByTime(1001)
    expect(toasts).toHaveLength(0)
  })

  it('clear removes all toasts', () => {
    const { toasts, show, clear } = useToast()
    show('A', { duration: 9999 })
    show('B', { duration: 9999 })
    expect(toasts).toHaveLength(2)
    clear()
    expect(toasts).toHaveLength(0)
  })

  it('show returns a unique id', () => {
    const { show, clear } = useToast()
    const id1 = show('A', { duration: 9999 })
    const id2 = show('B', { duration: 9999 })
    expect(id1).not.toBe(id2)
    clear()
  })
})
