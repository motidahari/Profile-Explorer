import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppDropdown from './AppDropdown.vue'

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('AppDropdown', () => {
  it('renders the placeholder when no value is selected', () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: null, options: OPTIONS, placeholder: 'Pick one' },
    })
    expect(wrapper.find('.app-dropdown__value').text()).toBe('Pick one')
  })

  it('renders the selected option label', () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: 'banana', options: OPTIONS },
    })
    expect(wrapper.find('.app-dropdown__value').text()).toBe('Banana')
  })

  it('opens the panel on trigger click', async () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    expect(wrapper.find('.app-dropdown__panel').exists()).toBe(false)
    await wrapper.find('.app-dropdown__trigger').trigger('click')
    expect(wrapper.find('.app-dropdown__panel').exists()).toBe(true)
  })

  it('closes the panel when the same option area is clicked again (toggle)', async () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    await wrapper.find('.app-dropdown__trigger').trigger('click')
    expect(wrapper.find('.app-dropdown__panel').exists()).toBe(true)
    await wrapper.find('.app-dropdown__trigger').trigger('click')
    expect(wrapper.find('.app-dropdown__panel').exists()).toBe(false)
  })

  it('filters options by search text', async () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: null, options: OPTIONS, searchable: true },
    })
    await wrapper.find('.app-dropdown__trigger').trigger('click')
    await wrapper.find('.app-dropdown__search').setValue('ban')
    const visibleOptions = wrapper.findAll(
      '.app-dropdown__option:not(.app-dropdown__option--empty)',
    )
    expect(visibleOptions).toHaveLength(1)
    expect(visibleOptions[0].text()).toBe('Banana')
  })

  it('emits update:modelValue when an option is selected', async () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    await wrapper.find('.app-dropdown__trigger').trigger('click')
    const firstOption = wrapper.findAll('.app-dropdown__option')[0]
    await firstOption.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted![0]).toEqual(['apple'])
  })

  it('closes the panel after selection', async () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    await wrapper.find('.app-dropdown__trigger').trigger('click')
    await wrapper.findAll('.app-dropdown__option')[0].trigger('click')
    expect(wrapper.find('.app-dropdown__panel').exists()).toBe(false)
  })

  it('marks the selected option with --selected modifier', async () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: 'cherry', options: OPTIONS },
    })
    await wrapper.find('.app-dropdown__trigger').trigger('click')
    const selectedOption = wrapper.find('.app-dropdown__option--selected')
    expect(selectedOption.exists()).toBe(true)
    expect(selectedOption.text()).toBe('Cherry')
  })

  it('renders the label when provided', () => {
    const wrapper = mount(AppDropdown, {
      props: { modelValue: null, options: OPTIONS, label: 'Fruit' },
    })
    expect(wrapper.find('.app-dropdown__label').text()).toBe('Fruit')
  })
})
