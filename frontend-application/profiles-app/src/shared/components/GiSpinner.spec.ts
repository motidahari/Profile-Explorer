import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiSpinner from './GiSpinner.vue'

describe('GiSpinner', () => {
  it('renders the spinner ring', () => {
    const wrapper = mount(GiSpinner)
    expect(wrapper.find('.gi-spinner__ring').exists()).toBe(true)
  })

  it('applies md size class by default', () => {
    const wrapper = mount(GiSpinner)
    expect(wrapper.classes()).toContain('gi-spinner--md')
  })

  it('applies sm size class', () => {
    const wrapper = mount(GiSpinner, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('gi-spinner--sm')
  })

  it('applies lg size class', () => {
    const wrapper = mount(GiSpinner, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('gi-spinner--lg')
  })

  it('has role="status" for accessibility', () => {
    const wrapper = mount(GiSpinner)
    expect(wrapper.attributes('role')).toBe('status')
  })
})
