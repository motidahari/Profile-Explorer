import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { mountWithPlugins } from '../../../shared/test/mountWithPlugins'
import ProfileDetailView from './ProfileDetailView.vue'
import { useProfilesStore } from '../stores/useProfilesStore'
import { randomUserApi } from '../services/randomUserApi'
import type { Profile } from '../types/profile'

// Mock both services so no real HTTP calls are made
vi.mock('../services/profiles.service', () => ({
  profilesService: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('../services/randomUserApi', () => ({
  randomUserApi: {
    fetchProfiles: vi.fn(),
  },
}))

function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'uuid-test-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    gender: 'female',
    age: 36,
    yearOfBirth: 1815,
    email: 'ada@example.com',
    phone: '555-0100',
    pictureUrl: 'https://example.com/ada.jpg',
    country: 'United Kingdom',
    city: 'London',
    state: 'England',
    street: '10 Downing St',
    ...overrides,
  }
}

// Mounts the view with the router navigated to the profile-detail route so
// route.query.source is set correctly for origin-conditional logic.
async function mountDetailViaRouter(profile: Profile, source: 'api' | 'db' = 'api') {
  setActivePinia(createPinia())
  const store = useProfilesStore()

  if (source === 'api') {
    store.randomProfiles = [profile]
  } else {
    store.savedProfiles = [profile]
  }

  const wrapper = mountWithPlugins(ProfileDetailView, {
    props: { id: profile.id },
  })

  await wrapper.vm.$router.push({
    name: 'profile-detail',
    params: { id: profile.id },
    query: { source },
  })
  await wrapper.vm.$nextTick()

  return { wrapper, store }
}

describe('ProfileDetailView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    // Provide a safe default so the store doesn't corrupt its array when
    // an unexpected fetchRandomProfiles is triggered during mount.
    vi.mocked(randomUserApi.fetchProfiles).mockResolvedValue([])
  })

  describe('loading and error states', () => {
    it('shows the spinner while resolving the profile', () => {
      setActivePinia(createPinia())
      // Store is empty so onMounted will fetch. Keep the fetch pending indefinitely
      // to assert the spinner is visible before the promise resolves.
      vi.mocked(randomUserApi.fetchProfiles).mockReturnValue(new Promise(() => undefined))

      const wrapper = mountWithPlugins(ProfileDetailView, {
        props: { id: 'some-id' },
      })

      expect(wrapper.find('.profile-detail__loading').exists()).toBe(true)
      expect(wrapper.find('.gi-spinner').exists()).toBe(true)
    })

    it('shows the error state when the fetch fails', async () => {
      setActivePinia(createPinia())
      vi.mocked(randomUserApi.fetchProfiles).mockRejectedValue(new Error('network error'))

      const wrapper = mountWithPlugins(ProfileDetailView, {
        props: { id: 'missing-id' },
      })

      // Wait for the onMounted async work to complete
      await new Promise((resolve) => setTimeout(resolve, 50))
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.gi-error-state').exists()).toBe(true)
    })

    it('shows the not-found error when the UUID is not in the fetched list', async () => {
      setActivePinia(createPinia())
      vi.mocked(randomUserApi.fetchProfiles).mockResolvedValue([makeProfile({ id: 'other-id' })])

      const wrapper = mountWithPlugins(ProfileDetailView, {
        props: { id: 'missing-id' },
      })

      await new Promise((resolve) => setTimeout(resolve, 50))
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.gi-error-state').exists()).toBe(true)
    })
  })

  describe('profile display', () => {
    it('renders the profile name when the profile is in the store', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      expect(wrapper.text()).toContain('Ada')
      expect(wrapper.text()).toContain('Lovelace')
    })

    it('renders a gender badge', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile({ gender: 'female' }), 'api')
      expect(wrapper.find('.gi-badge').exists()).toBe(true)
    })

    it('renders age and year of birth', async () => {
      const { wrapper } = await mountDetailViaRouter(
        makeProfile({ age: 36, yearOfBirth: 1815 }),
        'api',
      )
      expect(wrapper.text()).toContain('36')
      expect(wrapper.text()).toContain('1815')
    })

    it('renders email and phone fields', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      expect(wrapper.text()).toContain('ada@example.com')
      expect(wrapper.text()).toContain('555-0100')
    })

    it('pre-fills the first name and last name inputs', async () => {
      const { wrapper } = await mountDetailViaRouter(
        makeProfile({ firstName: 'Ada', lastName: 'Lovelace' }),
        'api',
      )
      const inputs = wrapper.findAll('input')
      const values = inputs.map((i) => (i.element as HTMLInputElement).value)
      expect(values).toContain('Ada')
      expect(values).toContain('Lovelace')
    })

    it('renders Latin-data elements with dir="ltr" for BiDi correctness', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      const ltrElements = wrapper.findAll('[dir="ltr"]')
      expect(ltrElements.length).toBeGreaterThan(0)
    })

    it('renders name inputs with dir="ltr" for correct caret behaviour in RTL layout', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      const ltrInputs = wrapper.findAll('input[dir="ltr"]')
      expect(ltrInputs.length).toBe(2) // first name + last name
    })
  })

  describe('origin-conditional buttons', () => {
    it('shows the Save button for an unsaved API profile', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      const labels = wrapper.findAll('button').map((b) => b.text())
      expect(labels.some((l) => l.includes('Save'))).toBe(true)
    })

    it('does not show the Save button for a DB-sourced profile', async () => {
      const profile = makeProfile()
      const { wrapper } = await mountDetailViaRouter(profile, 'db')
      const labels = wrapper.findAll('button').map((b) => b.text())
      expect(labels.some((l) => l === 'Save')).toBe(false)
    })

    it('shows the Delete button for a DB-sourced profile', async () => {
      const profile = makeProfile()
      setActivePinia(createPinia())
      const store = useProfilesStore()
      store.savedProfiles = [profile]

      const wrapper = mountWithPlugins(ProfileDetailView, { props: { id: profile.id } })
      await wrapper.vm.$router.push({
        name: 'profile-detail',
        params: { id: profile.id },
        query: { source: 'db' },
      })
      await wrapper.vm.$nextTick()

      const labels = wrapper.findAll('button').map((b) => b.text())
      expect(labels.some((l) => l.includes('Delete'))).toBe(true)
    })

    it('does not show Delete for an unsaved API-sourced profile', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      const labels = wrapper.findAll('button').map((b) => b.text())
      expect(labels.some((l) => l === 'Delete')).toBe(false)
    })

    it('always shows the Update button', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      const labels = wrapper.findAll('button').map((b) => b.text())
      expect(labels.some((l) => l.includes('Update'))).toBe(true)
    })

    it('always shows the Back button', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      const labels = wrapper.findAll('button').map((b) => b.text())
      expect(labels.some((l) => l.includes('Back'))).toBe(true)
    })
  })

  describe('Back button', () => {
    it('calls router.back() when the Back button is clicked', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      const backSpy = vi.spyOn(wrapper.vm.$router, 'back')
      const backBtn = wrapper.findAll('button').find((b) => b.text().includes('Back'))
      await backBtn?.trigger('click')
      expect(backSpy).toHaveBeenCalledOnce()
    })
  })

  describe('BEM structure', () => {
    it('renders the root .profile-detail element', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      expect(wrapper.find('.profile-detail').exists()).toBe(true)
    })

    it('renders the hero section', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      expect(wrapper.find('.profile-detail__hero').exists()).toBe(true)
    })

    it('renders the body grid', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      expect(wrapper.find('.profile-detail__body').exists()).toBe(true)
    })

    it('renders the actions section', async () => {
      const { wrapper } = await mountDetailViaRouter(makeProfile(), 'api')
      expect(wrapper.find('.profile-detail__actions').exists()).toBe(true)
    })
  })
})
