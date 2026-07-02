import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppToast from './AppToast.vue'

describe('AppToast', () => {
  it('renders the message', () => {
    const wrapper = mount(AppToast, {
      props: { id: 't1', message: 'Profile saved', type: 'success' },
    })
    expect(wrapper.find('.app-toast__message').text()).toBe('Profile saved')
  })

  it('applies the type modifier class', () => {
    const wrapper = mount(AppToast, {
      props: { id: 't1', message: 'Error occurred', type: 'error' },
    })
    expect(wrapper.classes()).toContain('app-toast--error')
  })

  it('applies info modifier as default when type is omitted', () => {
    const wrapper = mount(AppToast, { props: { id: 't1', message: 'Note' } })
    expect(wrapper.classes()).toContain('app-toast--info')
  })

  it('emits dismiss with the id when the close button is clicked', async () => {
    const wrapper = mount(AppToast, {
      props: { id: 'toast-42', message: 'Done', type: 'success' },
    })
    await wrapper.find('.app-toast__close').trigger('click')
    const emitted = wrapper.emitted('dismiss')
    expect(emitted).toBeDefined()
    expect(emitted![0]).toEqual(['toast-42'])
  })
})
