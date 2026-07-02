import { describe, it, expect } from 'vitest'
import { mountWithPlugins } from '../test/mountWithPlugins'
import AppLanguageSwitcher from './AppLanguageSwitcher.vue'

describe('AppLanguageSwitcher', () => {
  it('renders EN and HE buttons', () => {
    const wrapper = mountWithPlugins(AppLanguageSwitcher)
    const buttons = wrapper.findAll('.app-language-switcher__btn')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('EN')
    expect(buttons[1].text()).toBe('HE')
  })

  it('marks EN as active by default', () => {
    const wrapper = mountWithPlugins(AppLanguageSwitcher)
    const enBtn = wrapper.findAll('.app-language-switcher__btn')[0]
    expect(enBtn.classes()).toContain('app-language-switcher__btn--active')
  })

  it('sets locale to he when HE button is clicked', async () => {
    const wrapper = mountWithPlugins(AppLanguageSwitcher)
    const heBtn = wrapper.findAll('.app-language-switcher__btn')[1]
    await heBtn.trigger('click')
    expect(heBtn.classes()).toContain('app-language-switcher__btn--active')
  })
})
