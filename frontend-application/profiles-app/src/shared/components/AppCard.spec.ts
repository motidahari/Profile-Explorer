import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from './AppCard.vue'

describe('AppCard', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppCard, { slots: { default: '<p>Card content</p>' } })
    expect(wrapper.find('p').text()).toBe('Card content')
  })

  it('does not apply elevated class by default', () => {
    const wrapper = mount(AppCard)
    expect(wrapper.classes()).not.toContain('app-card--elevated')
  })

  it('applies elevated class when elevated prop is true', () => {
    const wrapper = mount(AppCard, { props: { elevated: true } })
    expect(wrapper.classes()).toContain('app-card--elevated')
  })

  it('does not apply hoverable class by default', () => {
    const wrapper = mount(AppCard)
    expect(wrapper.classes()).not.toContain('app-card--hoverable')
  })

  it('applies hoverable class when hoverable prop is true', () => {
    const wrapper = mount(AppCard, { props: { hoverable: true } })
    expect(wrapper.classes()).toContain('app-card--hoverable')
  })
})
