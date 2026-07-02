import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GiSkeleton from './GiSkeleton.vue'

describe('GiSkeleton', () => {
  it('applies rect variant by default', () => {
    const wrapper = mount(GiSkeleton)
    expect(wrapper.classes()).toContain('gi-skeleton--rect')
  })

  it('applies text variant', () => {
    const wrapper = mount(GiSkeleton, { props: { variant: 'text' } })
    expect(wrapper.classes()).toContain('gi-skeleton--text')
  })

  it('applies circle variant', () => {
    const wrapper = mount(GiSkeleton, { props: { variant: 'circle' } })
    expect(wrapper.classes()).toContain('gi-skeleton--circle')
  })

  it('applies width and height styles when provided', () => {
    const wrapper = mount(GiSkeleton, { props: { width: '80px', height: '80px' } })
    expect(wrapper.attributes('style')).toContain('width: 80px')
    expect(wrapper.attributes('style')).toContain('height: 80px')
  })

  it('has aria-hidden for accessibility', () => {
    const wrapper = mount(GiSkeleton)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })
})
