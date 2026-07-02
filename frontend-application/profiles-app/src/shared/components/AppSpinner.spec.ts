import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSpinner from './AppSpinner.vue'

describe('AppSpinner', () => {
  it('renders the spinner ring', () => {
    const wrapper = mount(AppSpinner)
    expect(wrapper.find('.app-spinner__ring').exists()).toBe(true)
  })

  it('applies md size class by default', () => {
    const wrapper = mount(AppSpinner)
    expect(wrapper.classes()).toContain('app-spinner--md')
  })

  it('applies sm size class', () => {
    const wrapper = mount(AppSpinner, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('app-spinner--sm')
  })

  it('applies lg size class', () => {
    const wrapper = mount(AppSpinner, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('app-spinner--lg')
  })

  it('has role="status" for accessibility', () => {
    const wrapper = mount(AppSpinner)
    expect(wrapper.attributes('role')).toBe('status')
  })
})
