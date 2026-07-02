import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiDropdown from './GiDropdown.vue'

const OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
]

describe('GiDropdown', () => {
  it('renders the placeholder when no value is selected', () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: null, options: OPTIONS, placeholder: 'Pick one' },
    })
    expect(wrapper.find('.gi-dropdown__value').text()).toBe('Pick one')
  })

  it('renders the selected option label', () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: 'banana', options: OPTIONS },
    })
    expect(wrapper.find('.gi-dropdown__value').text()).toBe('Banana')
  })

  it('opens the panel on trigger click', async () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    expect(wrapper.find('.gi-dropdown__panel').exists()).toBe(false)
    await wrapper.find('.gi-dropdown__trigger').trigger('click')
    expect(wrapper.find('.gi-dropdown__panel').exists()).toBe(true)
  })

  it('closes the panel when the same option area is clicked again (toggle)', async () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    await wrapper.find('.gi-dropdown__trigger').trigger('click')
    expect(wrapper.find('.gi-dropdown__panel').exists()).toBe(true)
    await wrapper.find('.gi-dropdown__trigger').trigger('click')
    expect(wrapper.find('.gi-dropdown__panel').exists()).toBe(false)
  })

  it('filters options by search text', async () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: null, options: OPTIONS, searchable: true },
    })
    await wrapper.find('.gi-dropdown__trigger').trigger('click')
    await wrapper.find('.gi-dropdown__search').setValue('ban')
    const visibleOptions = wrapper.findAll('.gi-dropdown__option:not(.gi-dropdown__option--empty)')
    expect(visibleOptions).toHaveLength(1)
    expect(visibleOptions[0].text()).toBe('Banana')
  })

  it('emits update:modelValue when an option is selected', async () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    await wrapper.find('.gi-dropdown__trigger').trigger('click')
    const firstOption = wrapper.findAll('.gi-dropdown__option')[0]
    await firstOption.trigger('click')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted![0]).toEqual(['apple'])
  })

  it('closes the panel after selection', async () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: null, options: OPTIONS },
    })
    await wrapper.find('.gi-dropdown__trigger').trigger('click')
    await wrapper.findAll('.gi-dropdown__option')[0].trigger('click')
    expect(wrapper.find('.gi-dropdown__panel').exists()).toBe(false)
  })

  it('marks the selected option with --selected modifier', async () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: 'cherry', options: OPTIONS },
    })
    await wrapper.find('.gi-dropdown__trigger').trigger('click')
    const selectedOption = wrapper.find('.gi-dropdown__option--selected')
    expect(selectedOption.exists()).toBe(true)
    expect(selectedOption.text()).toBe('Cherry')
  })

  it('renders the label when provided', () => {
    const wrapper = mount(GiDropdown, {
      props: { modelValue: null, options: OPTIONS, label: 'Fruit' },
    })
    expect(wrapper.find('.gi-dropdown__label').text()).toBe('Fruit')
  })
})
