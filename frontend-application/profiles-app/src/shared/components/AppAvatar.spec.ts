import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppAvatar from './AppAvatar.vue'

describe('AppAvatar', () => {
  it('renders the image when src is provided', () => {
    const wrapper = mount(AppAvatar, {
      props: { src: 'https://example.com/avatar.jpg', alt: 'Jane Doe' },
    })
    const img = wrapper.find('.app-avatar__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
    expect(img.attributes('alt')).toBe('Jane Doe')
  })

  it('renders the fallback when src is absent', () => {
    const wrapper = mount(AppAvatar)
    expect(wrapper.find('.app-avatar__fallback').exists()).toBe(true)
    expect(wrapper.find('.app-avatar__image').exists()).toBe(false)
  })

  it('applies the md size class by default', () => {
    const wrapper = mount(AppAvatar)
    expect(wrapper.classes()).toContain('app-avatar--md')
  })

  it('applies the sm size class', () => {
    const wrapper = mount(AppAvatar, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('app-avatar--sm')
  })

  it('applies the lg size class', () => {
    const wrapper = mount(AppAvatar, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('app-avatar--lg')
  })
})
