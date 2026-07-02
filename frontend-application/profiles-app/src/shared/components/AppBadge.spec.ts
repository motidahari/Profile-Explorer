import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppBadge from './AppBadge.vue'

describe('AppBadge', () => {
  it('renders the label', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Male' } })
    expect(wrapper.text()).toBe('Male')
  })

  it('applies neutral variant by default', () => {
    const wrapper = mount(AppBadge, { props: { label: 'X' } })
    expect(wrapper.classes()).toContain('app-badge--neutral')
  })

  it('applies the given variant class', () => {
    const wrapper = mount(AppBadge, { props: { label: 'OK', variant: 'success' } })
    expect(wrapper.classes()).toContain('app-badge--success')
  })

  it('applies error variant class', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Fail', variant: 'error' } })
    expect(wrapper.classes()).toContain('app-badge--error')
  })

  it('applies info variant class', () => {
    const wrapper = mount(AppBadge, { props: { label: 'Info', variant: 'info' } })
    expect(wrapper.classes()).toContain('app-badge--info')
  })
})
