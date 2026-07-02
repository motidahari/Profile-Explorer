import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiBadge from './GiBadge.vue'

describe('GiBadge', () => {
  it('renders the label', () => {
    const wrapper = mount(GiBadge, { props: { label: 'Male' } })
    expect(wrapper.text()).toBe('Male')
  })

  it('applies neutral variant by default', () => {
    const wrapper = mount(GiBadge, { props: { label: 'X' } })
    expect(wrapper.classes()).toContain('gi-badge--neutral')
  })

  it('applies the given variant class', () => {
    const wrapper = mount(GiBadge, { props: { label: 'OK', variant: 'success' } })
    expect(wrapper.classes()).toContain('gi-badge--success')
  })

  it('applies error variant class', () => {
    const wrapper = mount(GiBadge, { props: { label: 'Fail', variant: 'error' } })
    expect(wrapper.classes()).toContain('gi-badge--error')
  })

  it('applies info variant class', () => {
    const wrapper = mount(GiBadge, { props: { label: 'Info', variant: 'info' } })
    expect(wrapper.classes()).toContain('gi-badge--info')
  })
})
