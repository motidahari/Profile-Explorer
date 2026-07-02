import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiInput from './GiInput.vue'

describe('GiInput', () => {
  it('renders the label when provided', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '', label: 'Name' } })
    expect(wrapper.find('.gi-input__label').text()).toBe('Name')
  })

  it('does not render label element when label prop is absent', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '' } })
    expect(wrapper.find('.gi-input__label').exists()).toBe(false)
  })

  it('renders the error message when error prop is set', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '', error: 'Required' } })
    expect(wrapper.find('.gi-input__error').text()).toBe('Required')
  })

  it('does not render error element when error prop is absent', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '' } })
    expect(wrapper.find('.gi-input__error').exists()).toBe(false)
  })

  it('emits update:modelValue when the user types', async () => {
    const wrapper = mount(GiInput, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    await input.setValue('hello')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted![0]).toEqual(['hello'])
  })

  it('applies --ltr modifier when dir is ltr', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '', dir: 'ltr' } })
    expect(wrapper.classes()).toContain('gi-input--ltr')
  })

  it('does not apply --ltr modifier when dir is rtl', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '', dir: 'rtl' } })
    expect(wrapper.classes()).not.toContain('gi-input--ltr')
  })

  it('applies --error modifier when error is present', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '', error: 'Bad' } })
    expect(wrapper.classes()).toContain('gi-input--error')
  })

  it('sets placeholder on the input', () => {
    const wrapper = mount(GiInput, { props: { modelValue: '', placeholder: 'Type here' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Type here')
  })
})
