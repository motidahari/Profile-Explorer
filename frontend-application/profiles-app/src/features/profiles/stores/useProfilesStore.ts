import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { profilesService } from '../services/profiles.service'
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
      savedProfiles.value = await profilesService.getAll()
    } catch (err) {
      savedError.value = toMessage(err)
    } finally {
      savedLoading.value = false
    }
  }

  // POST /profiles. Optimistically pushes a provisional copy of the profile
  // into savedProfiles so the UI responds immediately without waiting for the
  // round-trip. On success the provisional entry is replaced with the server
  // response (which carries real createdAt/updatedAt). On failure the
  // provisional entry is removed and the error re-thrown for the UI to toast.
  async function saveProfile(profile: Profile): Promise<Profile> {
    // Capture before the optimistic mutation so the rollback branch is correct
    // even when isSaved() would return a different value after the push.
    const alreadySaved = isSaved(profile.id)

    if (!alreadySaved) {
      savedProfiles.value.push({ ...profile })
    }

    try {
      const created = await profilesService.create(toPayload(profile))

      if (!alreadySaved) {
        // Swap the provisional entry for the confirmed server response so
        // timestamps and any server-normalised fields are accurate.
        const provisionalIndex = savedProfiles.value.findIndex((p) => p.id === created.id)
        if (provisionalIndex !== -1) {
          savedProfiles.value[provisionalIndex] = created
        }
      }

      return created
    } catch (err) {
      if (!alreadySaved) {
        // Rollback: the provisional entry was never confirmed by the server.
        savedProfiles.value = savedProfiles.value.filter((p) => p.id !== profile.id)
      }
      throw err
    }
  }

  // Update a profile's name. If it is saved, the name is patched locally first
  // (optimistic) so the UI reflects the change immediately, then persisted via
  // PUT /profiles/:id. On failure the previous name is restored and the error
  // re-thrown. The in-memory-only (unsaved) branch patches local state without
  // a network call and is not optimistic because there is no rollback needed.
  async function updateProfileName(
    id: string,
    firstName: string,
    lastName: string,
  ): Promise<Profile | undefined> {
    if (isSaved(id)) {
      // Capture the name showing before the optimistic patch so we can restore
      // it if the API call fails.
      const existing = savedProfiles.value.find((p) => p.id === id)
      const previousFirst = existing?.firstName ?? ''
      const previousLast = existing?.lastName ?? ''

      // Optimistically update both lists so every screen reflects the change
      // without waiting for the API round-trip.
      patchLocalName(id, firstName, lastName)

      try {
        const updated = await profilesService.update(id, { firstName, lastName })
        // Reconcile with the server response in case it normalised the name.
        patchLocalName(id, updated.firstName, updated.lastName)
        return updated
      } catch (err) {
        // Rollback: restore the name that was visible before the optimistic patch.
        patchLocalName(id, previousFirst, previousLast)
        throw err
      }
    }

    patchLocalName(id, firstName, lastName)
    return getProfile(id, 'api')
  }

  // DELETE /profiles/:id. Removes the profile from savedProfiles immediately
  // (optimistic) so the UI responds without waiting for the server. On failure
  // the profile is restored to its original list position and the error
  // re-thrown so the UI can show a toast.
  async function deleteProfile(id: string): Promise<void> {
    // Record position and value before removal so the rollback is exact.
    const index = savedProfiles.value.findIndex((p) => p.id === id)
    const removed = savedProfiles.value[index]

    // Optimistically remove — the UI sees the deletion immediately.
    savedProfiles.value = savedProfiles.value.filter((p) => p.id !== id)

    try {
      await profilesService.remove(id)
    } catch (err) {
      // Rollback: splice the profile back into its original position.
      if (removed !== undefined) {
        savedProfiles.value.splice(index, 0, removed)
      }
      throw err
    }
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
