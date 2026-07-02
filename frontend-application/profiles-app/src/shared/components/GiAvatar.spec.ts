import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiAvatar from './GiAvatar.vue'

describe('GiAvatar', () => {
  it('renders the image when src is provided', () => {
    const wrapper = mount(GiAvatar, {
      props: { src: 'https://example.com/avatar.jpg', alt: 'Jane Doe' },
    })
    const img = wrapper.find('.gi-avatar__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/avatar.jpg')
    expect(img.attributes('alt')).toBe('Jane Doe')
  })

  it('renders the fallback when src is absent', () => {
    const wrapper = mount(GiAvatar)
    expect(wrapper.find('.gi-avatar__fallback').exists()).toBe(true)
    expect(wrapper.find('.gi-avatar__image').exists()).toBe(false)
  })

  it('applies the md size class by default', () => {
    const wrapper = mount(GiAvatar)
    expect(wrapper.classes()).toContain('gi-avatar--md')
  })

  it('applies the sm size class', () => {
    const wrapper = mount(GiAvatar, { props: { size: 'sm' } })
    expect(wrapper.classes()).toContain('gi-avatar--sm')
  })

  it('applies the lg size class', () => {
    const wrapper = mount(GiAvatar, { props: { size: 'lg' } })
    expect(wrapper.classes()).toContain('gi-avatar--lg')
  })
})
