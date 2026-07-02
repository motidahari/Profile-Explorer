import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import GiList from './GiList.vue'

describe('GiList', () => {
  it('renders a slot item for each element in items', () => {
    const itemSlot = ({ item }: { item: unknown; index: number }) => [h('span', {}, String(item))]
    const wrapper = mount(GiList, {
      props: { items: ['a', 'b', 'c'] },
      slots: { item: itemSlot },
    })
    const rows = wrapper.findAll('.gi-list__item')
    expect(rows).toHaveLength(3)
    expect(rows[0].text()).toBe('a')
    expect(rows[2].text()).toBe('c')
  })

  it('renders the #empty slot when items is empty', () => {
    const wrapper = mount(GiList, {
      props: { items: [] },
      slots: { empty: '<p class="empty-msg">Nothing here</p>' },
    })
    expect(wrapper.find('.empty-msg').exists()).toBe(true)
    expect(wrapper.find('.gi-list__item').exists()).toBe(false)
  })

  it('renders the loading slot when loading is true', () => {
    const wrapper = mount(GiList, {
      props: { items: [], loading: true },
      slots: { loading: '<span class="spinner-stub">loading</span>' },
    })
    expect(wrapper.find('.spinner-stub').exists()).toBe(true)
    expect(wrapper.find('.gi-list__item').exists()).toBe(false)
    expect(wrapper.find('.gi-list__empty').exists()).toBe(false)
  })

  it('does not render empty slot while loading', () => {
    const wrapper = mount(GiList, {
      props: { items: [], loading: true },
      slots: {
        loading: '<span>loading</span>',
        empty: '<p class="empty-msg">Empty</p>',
      },
    })
    expect(wrapper.find('.empty-msg').exists()).toBe(false)
  })

  it('passes index to the slot', () => {
    const itemSlot = ({ index }: { item: unknown; index: number }) => [
      h('span', { 'data-idx': String(index) }, 'item'),
    ]
    const wrapper = mount(GiList, {
      props: { items: ['x'] },
      slots: { item: itemSlot },
    })
    expect(wrapper.find('[data-idx="0"]').exists()).toBe(true)
  })
})
