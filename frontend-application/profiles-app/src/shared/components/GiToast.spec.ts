import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiToast from './GiToast.vue'

describe('GiToast', () => {
  it('renders the message', () => {
    const wrapper = mount(GiToast, {
      props: { id: 't1', message: 'Profile saved', type: 'success' },
    })
    expect(wrapper.find('.gi-toast__message').text()).toBe('Profile saved')
  })

  it('applies the type modifier class', () => {
    const wrapper = mount(GiToast, {
      props: { id: 't1', message: 'Error occurred', type: 'error' },
    })
    expect(wrapper.classes()).toContain('gi-toast--error')
  })

  it('applies info modifier as default when type is omitted', () => {
    const wrapper = mount(GiToast, { props: { id: 't1', message: 'Note' } })
    expect(wrapper.classes()).toContain('gi-toast--info')
  })

  it('emits dismiss with the id when the close button is clicked', async () => {
    const wrapper = mount(GiToast, {
      props: { id: 'toast-42', message: 'Done', type: 'success' },
    })
    await wrapper.find('.gi-toast__close').trigger('click')
    const emitted = wrapper.emitted('dismiss')
    expect(emitted).toBeDefined()
    expect(emitted![0]).toEqual(['toast-42'])
  })
})
