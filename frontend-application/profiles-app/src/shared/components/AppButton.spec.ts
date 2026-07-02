import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from './AppButton.vue'

describe('AppButton', () => {
  it('renders the slot label', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  it('applies the primary variant class by default', () => {
    const wrapper = mount(AppButton)
    expect(wrapper.classes()).toContain('app-button--primary')
  })

  it('applies the given variant class', () => {
    const wrapper = mount(AppButton, { props: { variant: 'danger' } })
    expect(wrapper.classes()).toContain('app-button--danger')
  })

  it('applies the given size class', () => {
    const wrapper = mount(AppButton, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('app-button--lg')
  })

  it('applies md size class by default', () => {
    const wrapper = mount(AppButton)
    expect(wrapper.classes()).toContain('app-button--md')
  })

  it('emits click when clicked', async () => {
    const wrapper = mount(AppButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', async () => {
    const wrapper = mount(AppButton, { props: { loading: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(AppButton, { props: { loading: true } })
    expect(wrapper.find('.app-button__spinner').exists()).toBe(true)
  })

  it('applies loading class when loading', () => {
    const wrapper = mount(AppButton, { props: { loading: true } })
    expect(wrapper.classes()).toContain('app-button--loading')
  })

  it('has disabled attribute when disabled', () => {
    const wrapper = mount(AppButton, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
