import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSkeleton from './AppSkeleton.vue'

describe('AppSkeleton', () => {
  it('applies rect variant by default', () => {
    const wrapper = mount(AppSkeleton)
    expect(wrapper.classes()).toContain('app-skeleton--rect')
  })

  it('applies text variant', () => {
    const wrapper = mount(AppSkeleton, { props: { variant: 'text' } })
    expect(wrapper.classes()).toContain('app-skeleton--text')
  })

  it('applies circle variant', () => {
    const wrapper = mount(AppSkeleton, { props: { variant: 'circle' } })
    expect(wrapper.classes()).toContain('app-skeleton--circle')
  })

  it('applies width and height styles when provided', () => {
    const wrapper = mount(AppSkeleton, { props: { width: '80px', height: '80px' } })
    expect(wrapper.attributes('style')).toContain('width: 80px')
    expect(wrapper.attributes('style')).toContain('height: 80px')
  })

  it('has aria-hidden for accessibility', () => {
    const wrapper = mount(AppSkeleton)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
