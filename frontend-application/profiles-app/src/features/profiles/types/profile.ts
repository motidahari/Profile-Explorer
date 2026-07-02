// Frontend-owned Profile type. Mirrors the backend `Profile` entity
// (backend-services/profiles-service/src/profiles/domain/profile.entity.ts).
// Each service owns its own copy of the domain types — there is no shared lib.

export type Gender = 'male' | 'female'

// Where a profile currently in view came from: the randomuser.me API or our DB.
export type ProfileSource = 'api' | 'db'

export interface Profile {
  // randomuser.me login.uuid — the stable identifier for a profile.
  id: string
  firstName: string
  lastName: string
  gender: Gender
  age: number
  yearOfBirth: number
  email: string
  phone: string
  pictureUrl: string
  country: string
  city: string
  state: string
  street: string
  // Set by the backend on persisted profiles; absent on API-only profiles.
  createdAt?: string
  updatedAt?: string
}

// Body for POST /profiles — every domain field, no server-managed timestamps.
export type CreateProfilePayload = Omit<Profile, 'createdAt' | 'updatedAt'>

// Body for PUT /profiles/:id — only the name is editable.
export interface UpdateProfilePayload {
  firstName?: string
  lastName?: string
}
