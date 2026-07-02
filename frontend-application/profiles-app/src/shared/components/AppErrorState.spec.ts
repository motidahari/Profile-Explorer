import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppErrorState from './AppErrorState.vue'

describe('AppErrorState', () => {
  it('renders the message', () => {
    const wrapper = mount(AppErrorState, { props: { message: 'Something went wrong' } })
    expect(wrapper.find('.app-error-state__message').text()).toBe('Something went wrong')
  })

  it('does not render the retry button when onRetry is absent', () => {
    const wrapper = mount(AppErrorState, { props: { message: 'Error' } })
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('renders the retry button when onRetry is provided', () => {
    const wrapper = mount(AppErrorState, {
      props: { message: 'Error', onRetry: vi.fn(), retryLabel: 'Retry' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn()
    const wrapper = mount(AppErrorState, {
      props: { message: 'Error', onRetry, retryLabel: 'Retry' },
    })
    await wrapper.find('button').trigger('click')
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
