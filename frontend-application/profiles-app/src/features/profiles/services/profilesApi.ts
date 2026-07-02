// Client for our own backend (profiles-service). Paths mirror the NestJS
// ProfilesController: GET/POST /profiles, PUT/DELETE /profiles/:id.
import http from '@/core/config/http'
import type { Profile, CreateProfilePayload, UpdateProfilePayload } from '../types/profile'

const RESOURCE = '/profiles'

export const profilesApi = {
  // GET /profiles — all saved profiles.
  async getAll(): Promise<Profile[]> {
    const { data } = await http.get<Profile[]>(RESOURCE)
    return data
  },

  // POST /profiles — persist a new profile. Backend returns 409 on duplicate id.
  async create(payload: CreateProfilePayload): Promise<Profile> {
    const { data } = await http.post<Profile>(RESOURCE, payload)
    return data
  },

  // PUT /profiles/:id — update a saved profile's name. Backend returns 404 if missing.
  async update(id: string, payload: UpdateProfilePayload): Promise<Profile> {
    const { data } = await http.put<Profile>(`${RESOURCE}/${id}`, payload)
    return data
  },

  // DELETE /profiles/:id — remove a saved profile (204 No Content).
  async remove(id: string): Promise<void> {
    await http.delete<void>(`${RESOURCE}/${id}`)
  },
}
