import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { profilesApi } from '../services/profilesApi'
import { randomUserApi } from '../services/randomUserApi'
import type { CreateProfilePayload, Profile, ProfileSource } from '../types/profile'

// Single Pinia store owning both profile lists (random from the API, saved from
// the DB), their loading/error states, and the mutation actions that back the
// four backend endpoints. Screens read from here; components never call the
// services directly.
export const useProfilesStore = defineStore('profiles', () => {
  // --- State ---
  const randomProfiles = ref<Profile[]>([])
  const savedProfiles = ref<Profile[]>([])

  const randomLoading = ref(false)
  const randomError = ref<string | null>(null)

  const savedLoading = ref(false)
  const savedError = ref<string | null>(null)

  // --- Getters ---
  const savedIds = computed(() => new Set(savedProfiles.value.map((p) => p.id)))
  const isSaved = (id: string): boolean => savedIds.value.has(id)

  // Look a profile up in the list matching its routed origin, falling back to
  // whichever list holds it. Backs profile-origin tracking through routing.
  function getProfile(id: string, source?: ProfileSource): Profile | undefined {
    if (source === 'db') return savedProfiles.value.find((p) => p.id === id)
    if (source === 'api') return randomProfiles.value.find((p) => p.id === id)
    return (
      savedProfiles.value.find((p) => p.id === id) ?? randomProfiles.value.find((p) => p.id === id)
    )
  }

  // --- Internal helpers ---
  // Drop the server-managed timestamps before sending a profile back to the API.
  function toPayload(profile: Profile): CreateProfilePayload {
    const payload = { ...profile }
    delete payload.createdAt
    delete payload.updatedAt
    return payload
  }

  // Patch the name in every list that holds this profile, so an update on one
  // screen is reflected everywhere the profile appears.
  function patchLocalName(id: string, firstName: string, lastName: string): void {
    for (const list of [randomProfiles.value, savedProfiles.value]) {
      const target = list.find((p) => p.id === id)
      if (target) {
        target.firstName = firstName
        target.lastName = lastName
      }
    }
  }

  function toMessage(err: unknown): string {
    if (err instanceof Error) return err.message
    return 'Unknown error'
  }

  // --- Actions ---
  async function fetchRandomProfiles(count?: number): Promise<void> {
    randomLoading.value = true
    randomError.value = null
    try {
      randomProfiles.value = await randomUserApi.fetchProfiles(count)
    } catch (err) {
      randomError.value = toMessage(err)
    } finally {
      randomLoading.value = false
    }
  }

  async function fetchSavedProfiles(): Promise<void> {
    savedLoading.value = true
    savedError.value = null
    try {
      savedProfiles.value = await profilesApi.getAll()
    } catch (err) {
      savedError.value = toMessage(err)
    } finally {
      savedLoading.value = false
    }
  }

  // POST /profiles. Errors (e.g. 409 duplicate) propagate to the caller so the
  // UI can surface them via toast.
  async function saveProfile(profile: Profile): Promise<Profile> {
    const created = await profilesApi.create(toPayload(profile))
    if (!isSaved(created.id)) {
      savedProfiles.value.push(created)
    }
    return created
  }

  // Update a profile's name. If it is saved, persist via PUT /profiles/:id;
  // otherwise patch the in-memory (API) copy only — an unsaved profile has no
  // backend record to update.
  async function updateProfileName(
    id: string,
    firstName: string,
    lastName: string,
  ): Promise<Profile | undefined> {
    if (isSaved(id)) {
      const updated = await profilesApi.update(id, { firstName, lastName })
      patchLocalName(id, updated.firstName, updated.lastName)
      return updated
    }
    patchLocalName(id, firstName, lastName)
    return getProfile(id, 'api')
  }

  // DELETE /profiles/:id. Removes the profile from the saved list on success.
  async function deleteProfile(id: string): Promise<void> {
    await profilesApi.remove(id)
    savedProfiles.value = savedProfiles.value.filter((p) => p.id !== id)
  }

  return {
    randomProfiles,
    savedProfiles,
    randomLoading,
    randomError,
    savedLoading,
    savedError,
    savedIds,
    isSaved,
    getProfile,
    fetchRandomProfiles,
    fetchSavedProfiles,
    saveProfile,
    updateProfileName,
    deleteProfile,
  }
})
