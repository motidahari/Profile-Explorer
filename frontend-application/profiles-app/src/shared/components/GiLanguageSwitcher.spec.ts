import { describe, it, expect } from 'vitest'
import { mountWithPlugins } from '../test/mountWithPlugins'
import GiLanguageSwitcher from './GiLanguageSwitcher.vue'

describe('GiLanguageSwitcher', () => {
  it('renders EN and HE buttons', () => {
    const wrapper = mountWithPlugins(GiLanguageSwitcher)
    const buttons = wrapper.findAll('.gi-language-switcher__btn')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('EN')
    expect(buttons[1].text()).toBe('HE')
  })

  it('marks EN as active by default', () => {
    const wrapper = mountWithPlugins(GiLanguageSwitcher)
    const enBtn = wrapper.findAll('.gi-language-switcher__btn')[0]
    expect(enBtn.classes()).toContain('gi-language-switcher__btn--active')
  })

  it('sets locale to he when HE button is clicked', async () => {
    const wrapper = mountWithPlugins(GiLanguageSwitcher)
    const heBtn = wrapper.findAll('.gi-language-switcher__btn')[1]
    await heBtn.trigger('click')
    expect(heBtn.classes()).toContain('gi-language-switcher__btn--active')
  })
})
