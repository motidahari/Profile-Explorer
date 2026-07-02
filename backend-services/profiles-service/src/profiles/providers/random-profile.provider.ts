import { Profile } from '../domain/profile.entity'

// A freshly generated profile that has not been persisted yet — the domain
// model without the DB-managed timestamps. Shaped to match CreateProfileDto so
// the frontend can POST it straight back to save it.
export type RandomProfile = Omit<Profile, 'createdAt' | 'updatedAt'>

// Abstraction over "where random profiles come from". Injected as a DI token so
// the source (randomuser.me today) can be swapped for another provider without
// touching ProfilesService. Bind a concrete implementation in ProfilesModule.
export abstract class RandomProfileProvider {
  abstract fetchRandom(count: number): Promise<RandomProfile[]>
}
