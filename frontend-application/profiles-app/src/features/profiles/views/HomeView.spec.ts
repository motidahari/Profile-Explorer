import { describe, it, expect, vi } from 'vitest'
import { mountWithPlugins } from '../../../shared/test/mountWithPlugins'
import HomeView from './HomeView.vue'

describe('HomeView', () => {
  it('renders the home title from i18n', () => {
    const wrapper = mountWithPlugins(HomeView)
    expect(wrapper.find('.home-view__title').text()).toBe('Profile Explorer')
  })

  it('renders the home subtitle from i18n', () => {
    const wrapper = mountWithPlugins(HomeView)
    expect(wrapper.find('.home-view__subtitle').text()).toBeTruthy()
  })

  it('renders two action buttons', () => {
    const wrapper = mountWithPlugins(HomeView)
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })

  it('navigates to random-list when Fetch button is clicked', async () => {
    const wrapper = mountWithPlugins(HomeView)
    const buttons = wrapper.findAll('button')
    const fetchBtn = buttons[0]
    const pushSpy = vi.spyOn(wrapper.vm.$router, 'push')
    await fetchBtn.trigger('click')
    expect(pushSpy).toHaveBeenCalledWith({ name: 'random-list' })
  })

  it('navigates to saved-list when History button is clicked', async () => {
    const wrapper = mountWithPlugins(HomeView)
    const buttons = wrapper.findAll('button')
    const historyBtn = buttons[1]
    const pushSpy = vi.spyOn(wrapper.vm.$router, 'push')
    await historyBtn.trigger('click')
    expect(pushSpy).toHaveBeenCalledWith({ name: 'saved-list' })
  })

  it('has the actions container', () => {
    const wrapper = mountWithPlugins(HomeView)
    expect(wrapper.find('.home-view__actions').exists()).toBe(true)
  })
})
