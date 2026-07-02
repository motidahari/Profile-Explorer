import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppToastContainer from './AppToastContainer.vue'
import { useToast } from '../composables/useToast'

describe('AppToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useToast().clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    useToast().clear()
  })

  it('renders toasts from the toast store', async () => {
    const { show } = useToast()
    show('Hello toast', { type: 'info', duration: 9999 })

    const wrapper = mount(AppToastContainer, {
      attachTo: document.body,
      global: { stubs: { teleport: true } },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Hello toast')
    wrapper.unmount()
  })

  it('removes a toast when dismissed', async () => {
    const { show } = useToast()
    show('Dismiss me', { type: 'info', duration: 9999 })

    const wrapper = mount(AppToastContainer, {
      attachTo: document.body,
      global: { stubs: { teleport: true } },
    })

    await wrapper.vm.$nextTick()
    await wrapper.find('.app-toast__close').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.app-toast').exists()).toBe(false)
    wrapper.unmount()
  })
})
