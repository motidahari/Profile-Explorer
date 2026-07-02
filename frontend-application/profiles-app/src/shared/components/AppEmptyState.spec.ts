import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppEmptyState from './AppEmptyState.vue'

describe('AppEmptyState', () => {
  it('renders the title', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'No results' } })
    expect(wrapper.find('.app-empty-state__title').text()).toBe('No results')
  })

  it('renders the description when provided', () => {
    const wrapper = mount(AppEmptyState, {
      props: { title: 'Empty', description: 'Try again later' },
    })
    expect(wrapper.find('.app-empty-state__description').text()).toBe('Try again later')
  })

  it('does not render description element when absent', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'Empty' } })
    expect(wrapper.find('.app-empty-state__description').exists()).toBe(false)
  })

  it('renders the icon text when provided', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'Empty', icon: '📭' } })
    expect(wrapper.find('.app-empty-state__icon').text()).toBe('📭')
  })

  it('renders the default SVG icon when icon prop is absent', () => {
    const wrapper = mount(AppEmptyState, { props: { title: 'Empty' } })
    expect(wrapper.find('.app-empty-state__icon-default').exists()).toBe(true)
    expect(wrapper.find('.app-empty-state__icon').exists()).toBe(false)
  })
})
