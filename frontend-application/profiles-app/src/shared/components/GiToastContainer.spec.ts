import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import GiToastContainer from './GiToastContainer.vue'
import { useToast } from '../composables/useToast'

describe('GiToastContainer', () => {
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

    const wrapper = mount(GiToastContainer, {
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

    const wrapper = mount(GiToastContainer, {
      attachTo: document.body,
      global: { stubs: { teleport: true } },
    })

    await wrapper.vm.$nextTick()
    await wrapper.find('.gi-toast__close').trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.gi-toast').exists()).toBe(false)
    wrapper.unmount()
  })
})
