import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProfilesStore } from './useProfilesStore'
import { profilesService } from '../services/profiles.service'
import { randomUserApi } from '../services/randomUserApi'
import type { Profile } from '../types/profile'

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
    id: 'uuid-1',
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

describe('useProfilesStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchRandomProfiles', () => {
    it('loads profiles from the randomuser API into randomProfiles', async () => {
      const profiles = [makeProfile(), makeProfile({ id: 'uuid-2' })]
      vi.mocked(randomUserApi.fetchProfiles).mockResolvedValue(profiles)
      const store = useProfilesStore()

      await store.fetchRandomProfiles()

      expect(randomUserApi.fetchProfiles).toHaveBeenCalledOnce()
      expect(store.randomProfiles).toEqual(profiles)
      expect(store.randomLoading).toBe(false)
      expect(store.randomError).toBeNull()
    })

    it('forwards the requested count', async () => {
      vi.mocked(randomUserApi.fetchProfiles).mockResolvedValue([])
      const store = useProfilesStore()

      await store.fetchRandomProfiles(5)

      expect(randomUserApi.fetchProfiles).toHaveBeenCalledWith(5)
    })

    it('captures the error message and clears loading on failure', async () => {
      vi.mocked(randomUserApi.fetchProfiles).mockRejectedValue(new Error('network down'))
      const store = useProfilesStore()

      await store.fetchRandomProfiles()

      expect(store.randomError).toBe('network down')
      expect(store.randomLoading).toBe(false)
      expect(store.randomProfiles).toEqual([])
    })
  })

  describe('fetchSavedProfiles', () => {
    it('loads profiles from the backend into savedProfiles', async () => {
      const profiles = [makeProfile()]
      vi.mocked(profilesService.getAll).mockResolvedValue(profiles)
      const store = useProfilesStore()

      await store.fetchSavedProfiles()

      expect(profilesService.getAll).toHaveBeenCalledOnce()
      expect(store.savedProfiles).toEqual(profiles)
      expect(store.savedError).toBeNull()
      expect(store.savedLoading).toBe(false)
    })

    it('captures the error message on failure', async () => {
      vi.mocked(profilesService.getAll).mockRejectedValue(new Error('server error'))
      const store = useProfilesStore()

      await store.fetchSavedProfiles()

      expect(store.savedError).toBe('server error')
      expect(store.savedLoading).toBe(false)
    })
  })

  describe('saveProfile', () => {
    it('posts the profile and appends the created record to savedProfiles', async () => {
      const profile = makeProfile()
      const created = makeProfile({ createdAt: '2026-07-02T00:00:00.000Z' })
      vi.mocked(profilesService.create).mockResolvedValue(created)
      const store = useProfilesStore()

      const result = await store.saveProfile(profile)

      expect(profilesService.create).toHaveBeenCalledOnce()
      expect(store.savedProfiles).toContainEqual(created)
      expect(result).toEqual(created)
    })

    it('strips server timestamps from the create payload', async () => {
      const profile = makeProfile({ createdAt: 'x', updatedAt: 'y' })
      vi.mocked(profilesService.create).mockResolvedValue(makeProfile())
      const store = useProfilesStore()

      await store.saveProfile(profile)

      const payload = vi.mocked(profilesService.create).mock.calls[0][0]
      expect(payload).not.toHaveProperty('createdAt')
      expect(payload).not.toHaveProperty('updatedAt')
      expect(payload.id).toBe(profile.id)
    })

    it('does not duplicate an already-saved profile', async () => {
      const saved = makeProfile()
      vi.mocked(profilesService.getAll).mockResolvedValue([saved])
      vi.mocked(profilesService.create).mockResolvedValue(saved)
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      await store.saveProfile(saved)

      expect(store.savedProfiles.filter((p) => p.id === saved.id)).toHaveLength(1)
    })

    it('propagates a duplicate (409) error to the caller', async () => {
      vi.mocked(profilesService.create).mockRejectedValue(
        new Error('Request failed with status code 409'),
      )
      const store = useProfilesStore()

      await expect(store.saveProfile(makeProfile())).rejects.toThrow('409')
      expect(store.savedProfiles).toEqual([])
    })

    // --- Optimistic save tests ---

    it('adds a provisional entry optimistically before the API responds', async () => {
      const profile = makeProfile()
      let resolveCreate!: (p: Profile) => void
      vi.mocked(profilesService.create).mockReturnValue(
        new Promise<Profile>((resolve) => {
          resolveCreate = resolve
        }),
      )
      const store = useProfilesStore()

      const savePromise = store.saveProfile(profile)

      // The provisional entry should be visible before the API responds.
      expect(store.savedProfiles).toHaveLength(1)
      expect(store.savedProfiles[0].id).toBe(profile.id)

      resolveCreate(makeProfile({ createdAt: '2026-07-02T00:00:00.000Z' }))
      await savePromise
    })

    it('reconciles the provisional entry with the server response on success', async () => {
      const profile = makeProfile()
      const created = makeProfile({
        createdAt: '2026-07-02T00:00:00.000Z',
        updatedAt: '2026-07-02T00:00:00.000Z',
      })
      vi.mocked(profilesService.create).mockResolvedValue(created)
      const store = useProfilesStore()

      await store.saveProfile(profile)

      expect(store.savedProfiles).toHaveLength(1)
      expect(store.savedProfiles[0]).toEqual(created)
    })

    it('removes the provisional entry and re-throws when the API rejects', async () => {
      vi.mocked(profilesService.create).mockRejectedValue(new Error('network error'))
      const store = useProfilesStore()

      await expect(store.saveProfile(makeProfile())).rejects.toThrow('network error')
      expect(store.savedProfiles).toHaveLength(0)
    })
  })

  describe('updateProfileName', () => {
    it('persists the name via the API when the profile is saved', async () => {
      const saved = makeProfile()
      vi.mocked(profilesService.getAll).mockResolvedValue([saved])
      vi.mocked(profilesService.update).mockResolvedValue(
        makeProfile({ firstName: 'Grace', lastName: 'Hopper' }),
      )
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      await store.updateProfileName(saved.id, 'Grace', 'Hopper')

      expect(profilesService.update).toHaveBeenCalledWith(saved.id, {
        firstName: 'Grace',
        lastName: 'Hopper',
      })
      const updated = store.savedProfiles.find((p) => p.id === saved.id)
      expect(updated?.firstName).toBe('Grace')
      expect(updated?.lastName).toBe('Hopper')
    })

    it('patches in-memory only when the profile is not saved', async () => {
      const apiProfile = makeProfile()
      vi.mocked(randomUserApi.fetchProfiles).mockResolvedValue([apiProfile])
      const store = useProfilesStore()
      await store.fetchRandomProfiles()

      await store.updateProfileName(apiProfile.id, 'Grace', 'Hopper')

      expect(profilesService.update).not.toHaveBeenCalled()
      const patched = store.randomProfiles.find((p) => p.id === apiProfile.id)
      expect(patched?.firstName).toBe('Grace')
      expect(patched?.lastName).toBe('Hopper')
    })

    it('reflects a saved-profile update across the random list too', async () => {
      const profile = makeProfile()
      vi.mocked(randomUserApi.fetchProfiles).mockResolvedValue([makeProfile()])
      vi.mocked(profilesService.getAll).mockResolvedValue([makeProfile()])
      vi.mocked(profilesService.update).mockResolvedValue(
        makeProfile({ firstName: 'Grace', lastName: 'Hopper' }),
      )
      const store = useProfilesStore()
      await store.fetchRandomProfiles()
      await store.fetchSavedProfiles()

      await store.updateProfileName(profile.id, 'Grace', 'Hopper')

      expect(store.randomProfiles[0].firstName).toBe('Grace')
      expect(store.savedProfiles[0].firstName).toBe('Grace')
    })

    // --- Optimistic name update tests ---

    it('patches the name optimistically before the API responds', async () => {
      const saved = makeProfile()
      vi.mocked(profilesService.getAll).mockResolvedValue([saved])
      let resolveUpdate!: (p: Profile) => void
      vi.mocked(profilesService.update).mockReturnValue(
        new Promise<Profile>((resolve) => {
          resolveUpdate = resolve
        }),
      )
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      const updatePromise = store.updateProfileName(saved.id, 'Grace', 'Hopper')

      // The name should be visible in the list before the API responds.
      expect(store.savedProfiles[0].firstName).toBe('Grace')
      expect(store.savedProfiles[0].lastName).toBe('Hopper')

      resolveUpdate(makeProfile({ firstName: 'Grace', lastName: 'Hopper' }))
      await updatePromise
    })

    it('rolls back the name to the previous value when the API rejects', async () => {
      const saved = makeProfile() // firstName: 'Ada', lastName: 'Lovelace'
      vi.mocked(profilesService.getAll).mockResolvedValue([saved])
      vi.mocked(profilesService.update).mockRejectedValue(new Error('server error'))
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      await expect(store.updateProfileName(saved.id, 'Grace', 'Hopper')).rejects.toThrow(
        'server error',
      )

      const profile = store.savedProfiles.find((p) => p.id === saved.id)
      expect(profile?.firstName).toBe('Ada')
      expect(profile?.lastName).toBe('Lovelace')
    })
  })

  describe('deleteProfile', () => {
    it('removes the profile from savedProfiles on success', async () => {
      vi.mocked(profilesService.getAll).mockResolvedValue([
        makeProfile(),
        makeProfile({ id: 'uuid-2' }),
      ])
      vi.mocked(profilesService.remove).mockResolvedValue(undefined)
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      await store.deleteProfile('uuid-1')

      expect(profilesService.remove).toHaveBeenCalledWith('uuid-1')
      expect(store.savedProfiles.map((p) => p.id)).toEqual(['uuid-2'])
    })

    it('propagates the error and keeps the list intact on failure', async () => {
      vi.mocked(profilesService.getAll).mockResolvedValue([makeProfile()])
      vi.mocked(profilesService.remove).mockRejectedValue(new Error('not found'))
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      await expect(store.deleteProfile('uuid-1')).rejects.toThrow('not found')
      expect(store.savedProfiles).toHaveLength(1)
    })

    // --- Optimistic delete tests ---

    it('removes the profile optimistically before the API responds', async () => {
      vi.mocked(profilesService.getAll).mockResolvedValue([makeProfile()])
      let resolveRemove!: () => void
      vi.mocked(profilesService.remove).mockReturnValue(
        new Promise<void>((resolve) => {
          resolveRemove = resolve
        }),
      )
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      const deletePromise = store.deleteProfile('uuid-1')

      // The profile should be gone before the API resolves.
      expect(store.savedProfiles).toHaveLength(0)

      resolveRemove()
      await deletePromise
      expect(store.savedProfiles).toHaveLength(0)
    })

    it('restores the deleted profile at its original list position on API failure', async () => {
      vi.mocked(profilesService.getAll).mockResolvedValue([
        makeProfile({ id: 'uuid-1' }),
        makeProfile({ id: 'uuid-2' }),
      ])
      vi.mocked(profilesService.remove).mockRejectedValue(new Error('server error'))
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      await expect(store.deleteProfile('uuid-1')).rejects.toThrow('server error')

      // uuid-1 must be restored at index 0, preserving the original order.
      expect(store.savedProfiles[0].id).toBe('uuid-1')
      expect(store.savedProfiles[1].id).toBe('uuid-2')
    })
  })

  describe('getters', () => {
    it('isSaved reflects the saved list', async () => {
      vi.mocked(profilesService.getAll).mockResolvedValue([makeProfile()])
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      expect(store.isSaved('uuid-1')).toBe(true)
      expect(store.isSaved('nope')).toBe(false)
    })

    it('getProfile resolves by explicit source', async () => {
      vi.mocked(randomUserApi.fetchProfiles).mockResolvedValue([
        makeProfile({ id: 'api-1', firstName: 'FromApi' }),
      ])
      vi.mocked(profilesService.getAll).mockResolvedValue([
        makeProfile({ id: 'db-1', firstName: 'FromDb' }),
      ])
      const store = useProfilesStore()
      await store.fetchRandomProfiles()
      await store.fetchSavedProfiles()

      expect(store.getProfile('api-1', 'api')?.firstName).toBe('FromApi')
      expect(store.getProfile('db-1', 'db')?.firstName).toBe('FromDb')
      expect(store.getProfile('api-1', 'db')).toBeUndefined()
    })

    it('getProfile falls back across both lists when no source is given', async () => {
      vi.mocked(profilesService.getAll).mockResolvedValue([makeProfile({ id: 'db-1' })])
      const store = useProfilesStore()
      await store.fetchSavedProfiles()

      expect(store.getProfile('db-1')?.id).toBe('db-1')
    })
  })
})
