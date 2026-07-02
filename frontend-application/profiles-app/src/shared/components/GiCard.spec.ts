import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiCard from './GiCard.vue'

describe('GiCard', () => {
  it('renders slot content', () => {
    const wrapper = mount(GiCard, { slots: { default: '<p>Card content</p>' } })
    expect(wrapper.find('p').text()).toBe('Card content')
  })

  it('does not apply elevated class by default', () => {
    const wrapper = mount(GiCard)
    expect(wrapper.classes()).not.toContain('gi-card--elevated')
  })

  it('applies elevated class when elevated prop is true', () => {
    const wrapper = mount(GiCard, { props: { elevated: true } })
    expect(wrapper.classes()).toContain('gi-card--elevated')
  })

  it('does not apply hoverable class by default', () => {
    const wrapper = mount(GiCard)
    expect(wrapper.classes()).not.toContain('gi-card--hoverable')
  })

  it('applies hoverable class when hoverable prop is true', () => {
    const wrapper = mount(GiCard, { props: { hoverable: true } })
    expect(wrapper.classes()).toContain('gi-card--hoverable')
  })
})
