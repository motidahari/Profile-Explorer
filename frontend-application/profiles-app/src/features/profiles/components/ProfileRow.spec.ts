import { describe, it, expect } from 'vitest'
import { mountWithPlugins } from '../../../shared/test/mountWithPlugins'
import ProfileRow from './ProfileRow.vue'
import type { Profile } from '../types/profile'

const mockProfile: Profile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Jane',
  lastName: 'Smith',
  gender: 'female',
  age: 28,
  yearOfBirth: 1996,
  email: 'jane.smith@example.com',
  phone: '555-9876',
  pictureUrl: 'https://example.com/photo.jpg',
  country: 'Canada',
  city: 'Toronto',
  state: 'ON',
  street: '42 Maple Ave',
}

describe('ProfileRow', () => {
  it('renders the full name', () => {
    const wrapper = mountWithPlugins(ProfileRow, {
      props: { profile: mockProfile },
    })
    expect(wrapper.find('.profile-row__name').text()).toBe('Jane Smith')
  })

  it('renders the avatar with the profile picture', () => {
    const wrapper = mountWithPlugins(ProfileRow, {
      props: { profile: mockProfile },
    })
    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/photo.jpg')
  })

  it('renders the country', () => {
    const wrapper = mountWithPlugins(ProfileRow, {
      props: { profile: mockProfile },
    })
    const metaItems = wrapper.findAll('.profile-row__meta-item')
    expect(metaItems[0].text()).toBe('Canada')
  })

  it('renders phone and email with dir="ltr"', () => {
    const wrapper = mountWithPlugins(ProfileRow, {
      props: { profile: mockProfile },
    })
    const ltrItems = wrapper.findAll('.profile-row__meta-item--ltr')
    expect(ltrItems).toHaveLength(2)
    ltrItems.forEach((item) => {
      expect(item.attributes('dir')).toBe('ltr')
    })
  })

  it('emits select with the profile when clicked', async () => {
    const wrapper = mountWithPlugins(ProfileRow, {
      props: { profile: mockProfile },
    })
    await wrapper.find('.profile-row').trigger('click')
    const emitted = wrapper.emitted('select')
    expect(emitted).toBeTruthy()
    expect(emitted![0][0]).toEqual(mockProfile)
  })

  it('renders the gender badge', () => {
    const wrapper = mountWithPlugins(ProfileRow, {
      props: { profile: mockProfile },
    })
    const badge = wrapper.find('.gi-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toBe('Female')
  })

  it('renders male badge for male profiles', () => {
    const maleProfile = { ...mockProfile, gender: 'male' as const }
    const wrapper = mountWithPlugins(ProfileRow, {
      props: { profile: maleProfile },
    })
    expect(wrapper.find('.gi-badge').text()).toBe('Male')
  })
})
