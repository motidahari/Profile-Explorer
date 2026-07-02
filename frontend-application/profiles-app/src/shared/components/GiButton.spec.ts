import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiButton from './GiButton.vue'

describe('GiButton', () => {
  it('renders the slot label', () => {
    const wrapper = mount(GiButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('applies the primary variant class by default', () => {
    const wrapper = mount(GiButton)
    expect(wrapper.classes()).toContain('gi-button--primary')
  })

  it('applies the given variant class', () => {
    const wrapper = mount(GiButton, { props: { variant: 'danger' } })
    expect(wrapper.classes()).toContain('gi-button--danger')
  })

  it('applies the given size class', () => {
    const wrapper = mount(GiButton, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('gi-button--lg')
  })

  it('applies md size class by default', () => {
    const wrapper = mount(GiButton)
    expect(wrapper.classes()).toContain('gi-button--md')
  })

  it('emits click when clicked', async () => {
    const wrapper = mount(GiButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(GiButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(GiButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(GiButton, { props: { loading: true } })
    expect(wrapper.find('.gi-button__spinner').exists()).toBe(true)
  })

  it('applies loading class when loading', () => {
    const wrapper = mount(GiButton, { props: { loading: true } })
    expect(wrapper.classes()).toContain('gi-button--loading')
  })

  it('has disabled attribute when disabled', () => {
    const wrapper = mount(GiButton, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
